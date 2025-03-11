import { Injectable, Logger, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { FirebaseService } from "../modules/services/firebase/firebase.service";
import {
    collection,
    doc,
    getDoc,
    deleteDoc,
    updateDoc,
    type Firestore,
    addDoc,
    getDocs,
    where,
    query,
    writeBatch,
} from "firebase/firestore";
import { EquipoEntrenador, ToSaveEquipoEntrenador } from "@/models/equipo-entrenador.model";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class EquipoEntrenadorService {
    private readonly logger = new Logger(EquipoEntrenadorService.name);
    private readonly db: Firestore;
    private readonly equiposCollection = "equipos-pokemon"
    private readonly equiposEntrenadorCollection = "equipos-entrenador";

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @Inject(FirebaseService)
        private readonly firebaseService: FirebaseService,
    ) {
        this.db = this.firebaseService.getFirestoreInstance();
        this.logger.log("Servicio de equipos de entrenador inicializado con Firestore");
    }

    // TODO: aplicar bien la logica del servicio de entrenador cuando se tenga
    async getEntrenador(id: number): Promise<boolean> {
        try {
            const url = this.configService.get<string>("TRAINERS_SERVICE_URL") || "/unexistent-url";
            const response = await firstValueFrom(this.httpService.get(`${url}/pokemon/${id}`));
            return response.status === 200;
        } catch (_error) {
            void _error;
            return false;
        }
    }

    async crearEquipoEntrenador(entrenadorId: number, equiposIds: string[], equipoSeleccionado: string): Promise<any> {
        try {
            const equipoData = new ToSaveEquipoEntrenador(entrenadorId, equiposIds, equipoSeleccionado);
            const equipoRef = collection(this.db, this.equiposEntrenadorCollection);
            const docRef = await addDoc(equipoRef, equipoData.getSaveJson());
            this.logger.log(`EquipoEntrenador creado con ID: ${docRef.id} para entrenador: ${entrenadorId}`);

            const equipoEntrenador = new EquipoEntrenador(docRef.id, entrenadorId, equiposIds, equipoSeleccionado);
            return equipoEntrenador.toJSON();
        } catch (error) {
            this.logger.error(`Error al guardar en Firestore: ${error.message}`);
            throw new HttpException(`Error al guardar equipo de entrenador en la base de datos`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async obtenerEquipoEntrenador(equipoEntrenadorId: string): Promise<any> {
        try {
            const equipoRef = doc(this.db, this.equiposEntrenadorCollection, equipoEntrenadorId);
            const equipoDoc = await getDoc(equipoRef);
            if (!equipoDoc.exists()) {
                throw new HttpException("Equipo de entrenador no encontrado", HttpStatus.NOT_FOUND);
            }
            return new EquipoEntrenador(
                equipoEntrenadorId,
                equipoDoc.data().entrenadorId,
                equipoDoc.data().equiposIds,
                equipoDoc.data().equipoSeleccionado
            ).toJSON();
        } catch (error) {
            this.logger.error(`Error al obtener equipo de entrenador: ${error.message}`);
            throw new HttpException(`Error al obtener equipo de entrenador`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async obtenerEquiposPorEntrenador(entrenadorId: number): Promise<any[]> {
        try {
            const q = query(collection(this.db, this.equiposEntrenadorCollection), where("entrenadorId", "==", entrenadorId));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                throw new HttpException("No se encontraron equipos para este entrenador", HttpStatus.NOT_FOUND);
            }

            return querySnapshot.docs.map(doc => new EquipoEntrenador(
                doc.id,
                doc.data().entrenadorId,
                doc.data().equiposIds,
                doc.data().equipoSeleccionado
            ).toJSON());
        } catch (error) {
            this.logger.error(`Error al obtener equipos por entrenador: ${error.message}`);
            throw new HttpException(`Error al obtener equipos por entrenador`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async actualizarEquipoEntrenador(equipoEntrenadorId: string, entrenadorId: number, equiposIds: string[], equipoSeleccionado: string): Promise<any> {
        try {
            const equipoRef = doc(this.db, this.equiposEntrenadorCollection, equipoEntrenadorId);
            const equipoDoc = await getDoc(equipoRef);

            if (!equipoDoc.exists()) {
                throw new HttpException("Equipo de entrenador no encontrado", HttpStatus.NOT_FOUND);
            }

            const equipoActualizado = new EquipoEntrenador(equipoEntrenadorId, entrenadorId, equiposIds, equipoSeleccionado);
            await updateDoc(equipoRef, equipoActualizado.getUpdateJson());

            this.logger.log(`Equipo de entrenador actualizado con ID: ${equipoEntrenadorId}`);
            return equipoActualizado.toJSON();
        } catch (error) {
            this.logger.error(`Error al actualizar equipo de entrenador: ${error.message}`);
            throw new HttpException(`Error al actualizar equipo de entrenador`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async eliminarEquipoEntrenador(equipoEntrenadorId: string): Promise<void> {
        try {
            const equipoRef = doc(this.db, this.equiposEntrenadorCollection, equipoEntrenadorId);
            const equipoDoc = await getDoc(equipoRef);

            if (!equipoDoc.exists()) {
                throw new HttpException("Equipo de entrenador no encontrado", HttpStatus.NOT_FOUND);
            }

            const { equiposIds } = equipoDoc.data();
            const batch = writeBatch(this.db);
            // Eliminar cada equipo de la colección "equipos-pokemon"
            equiposIds.forEach((equipoId: string) => {
                const equipoPokemonRef = doc(this.db, this.equiposCollection, equipoId);
                batch.delete(equipoPokemonRef);
            });

            // Ejecutar la eliminación en lote
            await batch.commit();
            this.logger.log(`Se eliminaron los equipos asociados: ${equiposIds.join(", ")}`);

            // Eliminar el equipo de entrenador después de eliminar sus equipos
            await deleteDoc(equipoRef);
            this.logger.log(`Equipo de entrenador eliminado con ID: ${equipoEntrenadorId}`);
        } catch (error) {
            this.logger.error(`Error al eliminar equipo de entrenador: ${error.message}`);
            throw new HttpException(`Error al eliminar equipo de entrenador`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}

import { Injectable, Logger, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Entrenador } from '../models/entrenador.model';
import { firstValueFrom } from 'rxjs';
import { FirebaseService } from '../modules/services/firebase/firebase.service';
import { doc, getDoc, updateDoc, Firestore } from 'firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Servicio que maneja las operaciones relacionadas con los Entrenadores
 * Se encarga de la comunicación con la API externa y el mapeo de datos
 */
@Injectable()
export class EntrenadorService {
    private readonly logger = new Logger(EntrenadorService.name);
    
    /**
     * URL de la API externa que proporciona los datos de los Entrenadores
     */
    private readonly apiUrl: string = 'https://run.mocky.io/v3/59ee04ac-55e0-414b-b516-74cf880d3b3c';
    private readonly db: Firestore;
    private readonly equiposCollection = "equipos-pokemon";

    /**
     * Constructor del servicio
     * @param httpService - Servicio de HTTP de NestJS para realizar peticiones
     * @param firebaseService - Servicio de Firebase para acceder a Firestore
     */
    constructor(
        private readonly httpService: HttpService,
        @Inject(FirebaseService)
        private readonly firebaseService: FirebaseService
    ) {
        this.logger.log(`Servicio iniciado con URL: ${this.apiUrl}`);
        this.db = this.firebaseService.getFirestoreInstance();
    }

    /**
     * Obtiene la lista completa de Entrenadores desde la API externa
     * @returns Promise<{ entrenadores: Entrenador[] }> - Objeto con array de Entrenadores
     * @throws Error si la respuesta de la API no es válida
     */
    async obtenerEntrenadores(): Promise<{ entrenadores: Entrenador[] }> {
        try {
            this.logger.log('Iniciando petición a la API para obtener entrenadores...');
            
            // Realiza la petición HTTP y espera la respuesta
            const { data } = await firstValueFrom(
                this.httpService.get(this.apiUrl)
            );
            
            this.logger.debug('Datos recibidos de la API:', JSON.stringify(data));

            // Valida que la respuesta tenga la estructura esperada
            if (!data || !data.entrenadores || !Array.isArray(data.entrenadores)) {
                throw new Error('La respuesta de la API no contiene un array de entrenadores válido');
            }

            // Mapea cada entrenador del array a una instancia de la clase Entrenador
            const entrenadoresArray = data.entrenadores.map(entrenador => {
                return new Entrenador(
                    entrenador.id,
                    entrenador.nombre,
                    entrenador.edad,
                    entrenador.sexo
                );
            });

            this.logger.log(`Se obtuvieron ${entrenadoresArray.length} entrenadores exitosamente`);
            
            return {
                entrenadores: entrenadoresArray
            };
        } catch (error) {
            this.logger.error(`Error al obtener entrenadores: ${error.message}`);
            throw new Error(`Error al obtener los entrenadores: ${error.message}`);
        }
    }

    /**
     * Elimina un Pokémon específico del equipo de un entrenador
     * @param entrenadorId - ID del entrenador propietario del equipo
     * @param pokemonId - ID del Pokémon a eliminar del equipo
     * @returns Promise<boolean> - true si se eliminó correctamente, false si no
     * @throws Error si ocurre algún problema durante la operación
     */
    async removePokemonFromTeam(entrenadorId: string, pokemonId: string): Promise<boolean> {
        try {
            this.logger.log(`Intentando eliminar Pokémon ${pokemonId} del equipo del entrenador ${entrenadorId}`);
            
            // Validar IDs
            const numericEntrenadorId = Number.parseInt(entrenadorId);
            const numericPokemonId = Number.parseInt(pokemonId);
            
            if (isNaN(numericEntrenadorId) || isNaN(numericPokemonId)) {
                throw new HttpException('IDs inválidos', HttpStatus.BAD_REQUEST);
            }
            
            // Obtener todos los equipos del entrenador
            const equiposRef = collection(this.db, this.equiposCollection);
            const q = query(equiposRef, where("entrenadorId", "==", numericEntrenadorId));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                this.logger.warn(`El entrenador ${entrenadorId} no tiene equipos registrados`);
                return false;
            }
            
            let pokemonRemoved = false;
            
            // Revisar cada equipo y eliminar el Pokémon si existe
            for (const docSnapshot of querySnapshot.docs) {
                const equipoData = docSnapshot.data();
                const pokemonIds = equipoData.pokemonIds || [];
                
                // Verificar si el Pokémon está en este equipo
                if (pokemonIds.includes(numericPokemonId)) {
                    // Eliminar el Pokémon del array
                    const updatedPokemonIds = pokemonIds.filter(id => id !== numericPokemonId);
                    
                    // Actualizar el documento en Firestore
                    await updateDoc(docSnapshot.ref, {
                        pokemonIds: updatedPokemonIds,
                        updatedAt: new Date().toISOString()
                    });
                    
                    this.logger.log(`Pokémon ${pokemonId} eliminado del equipo ${equipoData.equipoId}`);
                    pokemonRemoved = true;
                }
            }
            
            return pokemonRemoved;
        } catch (error) {
            this.logger.error(`Error al eliminar Pokémon del equipo: ${error.message}`);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                `Error al eliminar Pokémon del equipo: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
} 
import { Controller, Get, Delete, Logger, Param, HttpException, HttpStatus, Req, Res } from '@nestjs/common';
import { EntrenadorService } from '../services/entrenador.service';
import { Request, Response } from 'express';
import { FirebaseService } from '@/modules/services/firebase/firebase.service';
import { collection, Firestore, getDocs } from 'firebase/firestore';

/**
 * Controlador que maneja las rutas relacionadas con los Entrenadores
 * Expone los endpoints de la API REST para obtener información de Entrenadores
 */
@Controller('api/entrenadores')
export class EntrenadorController {
    private readonly logger = new Logger(EntrenadorController.name);
    private db: Firestore

    /**
     * Constructor del controlador
     * @param entrenadorService - Servicio que maneja la lógica de negocio de Entrenadores
     */
    constructor(private readonly entrenadorService: EntrenadorService, 
        private readonly firebaseService: FirebaseService) {
            this.db = this.firebaseService.getFirestoreInstance();
        }

    /**
     * Endpoint que obtiene la lista completa de Entrenadores
     * @route GET /api/entrenadores
     * @returns Promise con un objeto que contiene el array de Entrenadores
     * @throws Error si hay problemas al obtener los datos
     */
    @Get()
    async obtenerEntrenadores() {
        try {
            this.logger.log('Procesando solicitud para obtener entrenadores');
            const response = await this.entrenadorService.obtenerEntrenadores();
            return response; // Devuelve la respuesta en formato JSON
        } catch (error) {
            this.logger.error(`Error al obtener entrenadores: ${error.message}`);
            throw error;
        }
    }

    /**
     * Endpoint que obtiene un Entrenador específico por su ID
     * @route GET /api/entrenadores/:id
     * @param id - ID numérico del entrenador
     * @returns Promise con el Entrenador solicitado
     * @throws Error si el entrenador no existe o hay problemas al obtener los datos
     */
    @Get(':id')
    async obtenerEntrenadorPorId(@Param('id') id: string) {
        try {
            this.logger.log(`Procesando solicitud para obtener entrenador con ID: ${id}`);
            const { entrenadores } = await this.entrenadorService.obtenerEntrenadores();
            const numericId = parseInt(id);
            
            if (isNaN(numericId)) {
                throw new HttpException('ID de entrenador inválido', HttpStatus.BAD_REQUEST);
            }

            const entrenador = entrenadores.find(e => e.toJSON().id === numericId);
            if (!entrenador) {
                throw new HttpException('Entrenador no encontrado', HttpStatus.NOT_FOUND);
            }

            return entrenador;
        } catch (error) {
            this.logger.error(`Error al obtener entrenador: ${error.message}`);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Endpoint que elimina un Pokémon del equipo de un entrenador
     * @route DELETE /api/entrenadores/:entrenadorId/pokemon/:pokemonId
     * @param entrenadorId - ID del entrenador
     * @param pokemonId - ID del Pokémon
     * @returns Promise con un mensaje de confirmación
     * @throws Error si el entrenador o el Pokémon no existen
     */
    @Delete(':entrenadorId/pokemon/:pokemonId')
    async eliminarPokemonDelEquipo(@Param('entrenadorId') entrenadorId: string, @Param('pokemonId') pokemonId: string, @Req() req: Request, @Res() res: Response) {
        try {
            const result = await this.entrenadorService.removePokemonFromTeam(entrenadorId, pokemonId);
            if (result) {
                res.status(200).send({ message: 'Pokémon eliminado con éxito' });
            } else {
                res.status(404).send({ message: 'Pokémon no encontrado en el equipo' });
            }
        } catch (error) {
            this.logger.error(`Error al eliminar Pokémon del equipo: ${error.message}`);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    
    @Get("pruebaFirebase")
    async pruebaFirebase() {
        const querySnapshot = await getDocs(collection(this.db, 'aver')); // por favor pai, no tengan magic strings, separen los nombres de las collecciones en un archivo de configuración o en otro lado, hasta en los modelos podria ser, asi como se hace en laravel
        // otra cosam no me gustan los docstring que pone chat gpt, asi que borren los comentarios que no sean estrictamente necesarios
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
} 
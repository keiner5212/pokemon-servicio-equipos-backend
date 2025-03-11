import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Entrenador } from '../models/entrenador.model';

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
    private readonly apiUrl: string = 'https://run.mocky.io/v3/a7337c0c-7292-45c9-8e23-083fd9222b8e';

    /**
     * Constructor del servicio
     * @param httpService - Servicio de HTTP de NestJS para realizar peticiones
     */
    constructor(
        private readonly httpService: HttpService
    ) {
        this.logger.log(`Servicio iniciado con URL: ${this.apiUrl}`);
    }

    /**
     * Obtiene la lista completa de Entrenadores desde la API externa
     * @returns Promise<any> - Objeto con array de Entrenadores
     * @throws HttpException si la respuesta de la API no es válida
     */
    async obtenerEntrenadores(): Promise<any> {
        try {
            this.logger.log('Iniciando petición a la API para obtener entrenadores...');
            
            // Realiza la petición HTTP y espera la respuesta
            const response = await firstValueFrom(
                this.httpService.get(this.apiUrl)
            );

            const data = response.data;
            if (!data || !data.trainers || !Array.isArray(data.trainers)) {
                throw new HttpException(
                    'La respuesta del servicio de entrenadores no tiene el formato esperado',
                    HttpStatus.BAD_GATEWAY
                );
            }

            this.logger.log(`Se encontraron ${data.trainers.length} entrenadores`);
            return { trainers: data.trainers };
        } catch (error) {
            this.logger.error(`Error al obtener entrenadores: ${error.message}`);
            throw new HttpException(
                'Error al conectar con el servicio de entrenadores',
                HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }

    /**
     * Obtiene un Entrenador específico desde la API externa
     * @param id - ID del Entrenador a obtener
     * @returns Promise<any> - Entrenador encontrado
     * @throws HttpException si el Entrenador no es encontrado o hay un error en la petición
     */
    async obtenerEntrenador(id: number): Promise<any> {
        try {
            const { trainers } = await this.obtenerEntrenadores();
            const entrenador = trainers.find(t => parseInt(t.id) === id);
            
            if (!entrenador) {
                throw new HttpException(
                    `Entrenador con ID ${id} no encontrado`,
                    HttpStatus.NOT_FOUND
                );
            }

            return entrenador;
        } catch (error) {
            this.logger.error(`Error al obtener entrenador ${id}: ${error.message}`);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                `Error al obtener el entrenador: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async removePokemonFromTeam(entrenadorId: string, pokemonId: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
} 
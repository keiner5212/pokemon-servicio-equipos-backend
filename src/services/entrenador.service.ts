import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Entrenador } from '../models/entrenador.model';
import { firstValueFrom } from 'rxjs';

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

    async removePokemonFromTeam(entrenadorId: string, pokemonId: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
} 
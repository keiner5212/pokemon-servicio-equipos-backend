import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Pokemon } from '../models/pokemon.model';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

/**
 * Servicio que maneja las operaciones relacionadas con los Pokémon
 * Se encarga de la comunicación con la API externa y el mapeo de datos
 */
@Injectable()
export class PokemonService {
    private readonly logger = new Logger(PokemonService.name);
    
    /**
     * URL de la API externa que proporciona los datos de los Pokémon
     * Esta URL devuelve un JSON con un array de pokemones y sus características
     */
    private readonly apiUrl: string = 'https://run.mocky.io/v3/74e0af84-03e3-4083-8e07-be4c5b826b26';

    /**
     * Constructor del servicio
     * @param httpService - Servicio de HTTP de NestJS para realizar peticiones
     * @param configService - Servicio de configuración para acceder a variables de entorno
     */
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.logger.log(`Servicio iniciado con URL: ${this.apiUrl}`);
    }

    /**
     * Obtiene la lista completa de Pokémon desde la API externa
     * Realiza la petición HTTP, valida la respuesta y mapea los datos al modelo Pokemon
     * @returns Promise<{ pokemones: Pokemon[] }> - Objeto con array de Pokémon
     * @throws Error si la respuesta de la API no es válida o si faltan datos
     */
    async obtenerPokemones(): Promise<{ pokemones: Pokemon[] }> {
        try {
            this.logger.log('Iniciando petición a la API para obtener pokemones...');
            
            // Realiza la petición HTTP y espera la respuesta
            const { data } = await firstValueFrom(
                this.httpService.get(this.apiUrl)
            );
            
            this.logger.debug('Datos recibidos de la API:', JSON.stringify(data));

            // Valida que la respuesta tenga la estructura esperada
            if (!data || !data.pokemones || !Array.isArray(data.pokemones)) {
                throw new Error('La respuesta de la API no contiene un array de pokemones válido');
            }

            // Mapea cada pokemon del array a una instancia de la clase Pokemon
            const pokemonesArray = data.pokemones.map(pokemon => {
                if (!pokemon.estadisticas) {
                    this.logger.error(`Pokemon sin estadísticas: ${JSON.stringify(pokemon)}`);
                    throw new Error(`El pokemon ${pokemon.nombre || 'desconocido'} no tiene estadísticas`);
                }

                return new Pokemon(
                    pokemon.id,
                    pokemon.nombre,
                    pokemon.tipos,
                    pokemon.nivel,
                    {
                        hp: pokemon.estadisticas.hp,
                        ataque: pokemon.estadisticas.ataque,
                        defensa: pokemon.estadisticas.defensa,
                        ataque_especial: pokemon.estadisticas.ataque_especial,
                        defensa_especial: pokemon.estadisticas.defensa_especial,
                        velocidad: pokemon.estadisticas.velocidad
                    },
                    pokemon.movimientos,
                    pokemon.sprite
                );
            });

            this.logger.log(`Se obtuvieron ${pokemonesArray.length} pokemones exitosamente`);
            
            return {
                pokemones: pokemonesArray
            };
        } catch (error) {
            this.logger.error(`Error al obtener pokemones: ${error.message}`);
            throw new Error(`Error al obtener los pokemones: ${error.message}`);
        }
    }
} 
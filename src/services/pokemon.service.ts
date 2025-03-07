import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
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
    private pokemones: Pokemon[] = [];
    
    /**
     * URL de la API externa que proporciona los datos de los Pokémon
     * Esta URL devuelve un JSON con un array de pokemones y sus características
     */
    private readonly apiUrl: string = 'https://run.mocky.io/v3/80b8134b-409a-4d85-bb3c-52a4a5548c36';

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
        // Cargar los Pokemon al iniciar el servicio
        this.cargarPokemones();
    }

    /**
     * Carga inicial de Pokemon desde la API externa
     */
    private async cargarPokemones() {
        try {
            const { data } = await firstValueFrom(
                this.httpService.get(this.apiUrl)
            );
            
            if (!data || !data.pokemones || !Array.isArray(data.pokemones)) {
                throw new Error('Formato de respuesta inválido');
            }

            this.pokemones = data.pokemones.map(pokemon => new Pokemon(
                pokemon.id,
                pokemon.nombre,
                pokemon.tipos,
                pokemon.nivel,
                pokemon.estadisticas,
                pokemon.movimientos,
                pokemon.sprite
            ));

            this.logger.log(`${this.pokemones.length} Pokemon cargados correctamente`);
        } catch (error) {
            this.logger.error('Error al cargar Pokemon:', error);
            throw new HttpException(
                'Error al cargar la base de datos de Pokemon',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Obtiene la lista completa de Pokémon
     * @returns Promise<{ pokemones: Pokemon[] }> - Objeto con array de Pokémon
     */
    async obtenerPokemones(): Promise<{ pokemones: Pokemon[] }> {
        return { pokemones: this.pokemones };
    }

    /**
     * Obtiene un Pokémon específico por su ID
     * @param id - ID del Pokémon a buscar
     * @returns Promise<Pokemon> - Pokemon encontrado
     * @throws HttpException si el Pokemon no existe
     */
    async obtenerPokemonPorId(id: number): Promise<Pokemon> {
        const pokemon = this.pokemones.find(p => p.getId() === id);
        
        if (!pokemon) {
            throw new HttpException(
                `Pokemon con ID ${id} no encontrado`,
                HttpStatus.NOT_FOUND
            );
        }
        
        return pokemon;
    }
}
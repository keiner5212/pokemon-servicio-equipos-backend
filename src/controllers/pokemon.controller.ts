import { Controller, Get, Logger } from '@nestjs/common';
import { PokemonService } from '../services/pokemon.service';

/**
 * Controlador que maneja las rutas relacionadas con los Pokémon
 * Expone los endpoints de la API REST para obtener información de Pokémon
 */
@Controller('api')
export class PokemonController {
    private readonly logger = new Logger(PokemonController.name);

    /**
     * Constructor del controlador
     * @param pokemonService - Servicio que maneja la lógica de negocio de Pokémon
     */
    constructor(private readonly pokemonService: PokemonService) {}

    /**
     * Endpoint que obtiene la lista completa de Pokémon
     * @route GET /api/pokemones
     * @returns Promise con un objeto que contiene el array de Pokémon
     * @throws Error si hay problemas al obtener los datos
     */
    @Get('pokemones')
    async obtenerPokemones() {
        try {
            this.logger.log('Procesando solicitud para obtener pokemones');
            // Delega la obtención de datos al servicio
            const response = await this.pokemonService.obtenerPokemones();
            return response; // Devuelve la respuesta en formato JSON
        } catch (error) {
            this.logger.error(`Error al obtener pokemones: ${error.message}`);
            throw error;
        }
    }
} 
import { Controller, Get, Logger, Param } from '@nestjs/common';
import { PokemonService } from '../services/pokemon.service';

/**
 * Controlador que maneja las rutas relacionadas con los Pokémon
 * Expone los endpoints de la API REST para obtener información de Pokémon
 */
@Controller('api/pokemon')
export class PokemonController {
    private readonly logger = new Logger(PokemonController.name);

    /**
     * Constructor del controlador
     * @param pokemonService - Servicio que maneja la lógica de negocio de Pokémon
     */
    constructor(private readonly pokemonService: PokemonService) {}

    /**
     * Endpoint que obtiene la lista completa de Pokémon
     * @route GET /api/pokemon
     * @returns Promise con un objeto que contiene el array de Pokémon
     * @throws Error si hay problemas al obtener los datos
     */
    @Get()
    async obtenerPokemones() {
        try {
            this.logger.log('Procesando solicitud para obtener pokemones');
            const response = await this.pokemonService.obtenerPokemones();
            return response;
        } catch (error) {
            this.logger.error(`Error al obtener pokemones: ${error.message}`);
            throw error;
        }
    }

    /**
     * Endpoint que obtiene un Pokémon específico por su ID
     * @route GET /api/pokemon/:id
     * @param id - ID del Pokémon a buscar
     * @returns Promise con el Pokémon encontrado
     * @throws Error si el Pokémon no existe o hay problemas al obtener los datos
     */
    @Get(':id')
    async obtenerPokemonPorId(@Param('id') id: string) {
        try {
            this.logger.log(`Procesando solicitud para obtener pokemon con ID: ${id}`);
            const numericId = parseInt(id);
            const response = await this.pokemonService.obtenerPokemonPorId(numericId);
            return response;
        } catch (error) {
            this.logger.error(`Error al obtener pokemon con ID ${id}: ${error.message}`);
            throw error;
        }
    }
}
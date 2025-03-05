import { Controller, Get, Post, Put, Delete, Param, Body, Logger, ParseIntPipe } from '@nestjs/common';
import { EquipoPokemonService } from '../services/equipo-pokemon.service';

/**
 * Controlador que maneja las rutas relacionadas con los Equipos Pokémon
 */
@Controller('api/equipos')
export class EquipoPokemonController {
    private readonly logger = new Logger(EquipoPokemonController.name);

    constructor(private readonly equipoPokemonService: EquipoPokemonService) {}

    /**
     * Obtiene el equipo Pokémon de un entrenador específico
     * @route GET /api/equipos/entrenador/:id
     */
    @Get('entrenador/:id')
    async obtenerEquipoPorEntrenador(@Param('id', ParseIntPipe) entrenadorId: number) {
        try {
            this.logger.log(`Obteniendo equipo del entrenador ${entrenadorId}`);
            const equipo = await this.equipoPokemonService.obtenerEquipoPorEntrenador(entrenadorId);
            return equipo;
        } catch (error) {
            this.logger.error(`Error al obtener equipo: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene todos los equipos Pokémon registrados
     * @route GET /api/equipos
     */
    @Get()
    async obtenerTodosLosEquipos() {
        try {
            this.logger.log('Obteniendo todos los equipos');
            const equipos = await this.equipoPokemonService.obtenerTodosLosEquipos();
            return { equipos };
        } catch (error) {
            this.logger.error(`Error al obtener equipos: ${error.message}`);
            throw error;
        }
    }

    /**
     * Crea un nuevo equipo Pokémon para un entrenador
     * @route POST /api/equipos/entrenador/:id
     */
    @Post('entrenador/:id')
    async crearEquipo(
        @Param('id', ParseIntPipe) entrenadorId: number,
        @Body() body: { pokemonIds: number[] }
    ) {
        try {
            this.logger.log(`Creando equipo para entrenador ${entrenadorId}`);
            const equipo = await this.equipoPokemonService.crearEquipo(
                entrenadorId,
                body.pokemonIds
            );
            return equipo;
        } catch (error) {
            this.logger.error(`Error al crear equipo: ${error.message}`);
            throw error;
        }
    }

    /**
     * Modifica el equipo Pokémon de un entrenador
     * @route PUT /api/equipos/entrenador/:id
     */
    @Put('entrenador/:id')
    async modificarEquipo(
        @Param('id', ParseIntPipe) entrenadorId: number,
        @Body() body: { pokemonIds: number[] }
    ) {
        try {
            this.logger.log(`Modificando equipo del entrenador ${entrenadorId}`);
            const equipo = await this.equipoPokemonService.modificarEquipo(
                entrenadorId,
                body.pokemonIds
            );
            return equipo;
        } catch (error) {
            this.logger.error(`Error al modificar equipo: ${error.message}`);
            throw error;
        }
    }

    /**
     * Elimina el equipo Pokémon de un entrenador
     * @route DELETE /api/equipos/entrenador/:id
     */
    @Delete('entrenador/:id')
    async eliminarEquipo(@Param('id', ParseIntPipe) entrenadorId: number) {
        try {
            this.logger.log(`Eliminando equipo del entrenador ${entrenadorId}`);
            const resultado = await this.equipoPokemonService.eliminarEquipo(entrenadorId);
            return { eliminado: resultado };
        } catch (error) {
            this.logger.error(`Error al eliminar equipo: ${error.message}`);
            throw error;
        }
    }
} 
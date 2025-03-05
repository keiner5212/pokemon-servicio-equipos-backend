import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Logger } from '@nestjs/common';
import { EquipoPokemonService } from '../services/equipo-pokemon.service';
import { EquipoPokemon } from '../models/equipo-pokemon.model';

/**
 * Controlador que maneja las operaciones de Equipos Pokémon
 */
@Controller('api/equipos')
export class EquipoPokemonController {
    private readonly logger = new Logger(EquipoPokemonController.name);

    constructor(private readonly equipoPokemonService: EquipoPokemonService) {}

    /**
     * Obtiene todos los equipos de un entrenador específico
     */
    @Get('entrenador/:id')
    async obtenerEquiposPorEntrenador(@Param('id', ParseIntPipe) entrenadorId: number) {
        this.logger.log(`Obteniendo equipos del entrenador ${entrenadorId}`);
        return await this.equipoPokemonService.obtenerEquiposPorEntrenador(entrenadorId);
    }

    /**
     * Obtiene un equipo específico por su ID
     */
    @Get(':id')
    async obtenerEquipoPorId(@Param('id', ParseIntPipe) equipoId: number): Promise<EquipoPokemon> {
        this.logger.log(`Obteniendo equipo con ID ${equipoId}`);
        return await this.equipoPokemonService.obtenerEquipoPorId(equipoId);
    }

    /**
     * Obtiene todos los equipos Pokémon registrados
     */
    @Get()
    async obtenerTodosLosEquipos() {
        this.logger.log('Obteniendo todos los equipos');
        return await this.equipoPokemonService.obtenerTodosLosEquipos();
    }

    /**
     * Crea un nuevo equipo Pokémon para un entrenador
     */
    @Post('entrenador/:id')
    async crearEquipo(
        @Param('id', ParseIntPipe) entrenadorId: number,
        @Body('pokemonIds') pokemonIds: number[]
    ): Promise<EquipoPokemon> {
        this.logger.log(`Creando equipo para entrenador ${entrenadorId}`);
        return await this.equipoPokemonService.crearEquipo(entrenadorId, pokemonIds);
    }

    /**
     * Modifica un equipo Pokémon específico
     */
    @Put(':id')
    async modificarEquipo(
        @Param('id', ParseIntPipe) equipoId: number,
        @Body('pokemonIds') pokemonIds: number[]
    ): Promise<EquipoPokemon> {
        this.logger.log(`Modificando equipo ${equipoId}`);
        return await this.equipoPokemonService.modificarEquipo(equipoId, pokemonIds);
    }

    /**
     * Elimina un equipo Pokémon específico
     */
    @Delete(':id')
    async eliminarEquipo(@Param('id', ParseIntPipe) equipoId: number): Promise<boolean> {
        this.logger.log(`Eliminando equipo ${equipoId}`);
        return await this.equipoPokemonService.eliminarEquipo(equipoId);
    }
} 
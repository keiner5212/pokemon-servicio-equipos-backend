import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { EquipoService } from '../services/equipo.service';
import { EquipoPokemon } from '../models/equipo';

interface CrearEquipoDto {
    nombre: string;
    pokemonIds: number[];
}

interface ActualizarEquipoDto {
    nombre: string;
    pokemonIds: number[];
}

interface EntrenadorResponse {
    id: number;
    nombre: string;
    edad: number;
    sexo: string;
}

interface EquipoResponse {
    entrenador: EntrenadorResponse;
    equipos: EquipoPokemon | EquipoPokemon[];
}

@Controller('equipos')
export class EquipoController {
    constructor(private readonly equipoService: EquipoService) {}

    @Post(':entrenadorId')
    async crearEquipo(
        @Param('entrenadorId') entrenadorId: string,
        @Body() crearEquipoDto: CrearEquipoDto
    ): Promise<EquipoResponse> {
        return await this.equipoService.crearEquipo(
            entrenadorId,
            crearEquipoDto.nombre,
            crearEquipoDto.pokemonIds
        );
    }

    @Get(':entrenadorId')
    async obtenerEquipos(
        @Param('entrenadorId') entrenadorId: string
    ): Promise<EquipoResponse> {
        return await this.equipoService.obtenerEquipos(entrenadorId);
    }

    @Get(':entrenadorId/:equipoId')
    async obtenerEquipo(
        @Param('entrenadorId') entrenadorId: string,
        @Param('equipoId') equipoId: string
    ): Promise<EquipoResponse> {
        return await this.equipoService.obtenerEquipo(entrenadorId, equipoId);
    }

    @Put(':entrenadorId/:equipoId')
    async actualizarEquipo(
        @Param('entrenadorId') entrenadorId: string,
        @Param('equipoId') equipoId: string,
        @Body() actualizarEquipoDto: ActualizarEquipoDto
    ): Promise<EquipoResponse> {
        return await this.equipoService.actualizarEquipo(
            entrenadorId,
            equipoId,
            actualizarEquipoDto.nombre,
            actualizarEquipoDto.pokemonIds
        );
    }

    @Delete(':entrenadorId/:equipoId')
    async eliminarEquipo(
        @Param('entrenadorId') entrenadorId: string,
        @Param('equipoId') equipoId: string
    ): Promise<void> {
        await this.equipoService.eliminarEquipo(entrenadorId, equipoId);
    }

    @Get()
    async obtenerTodosLosEntrenadores(): Promise<EquipoResponse[]> {
        return await this.equipoService.obtenerTodosLosEntrenadores();
    }
}

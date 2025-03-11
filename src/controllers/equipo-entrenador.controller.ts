import { Controller, Get, Post, Put, Delete, Param, Body, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { EquipoEntrenadorService } from '../services/equipo-entrenador.service';

@Controller('api/equipos-entrenador')
export class EquipoEntrenadorController {
    private readonly logger = new Logger(EquipoEntrenadorController.name);

    constructor(private readonly equipoEntrenadorService: EquipoEntrenadorService) { }

    @Post()
    async crearEquipoEntrenador(
        @Body('entrenadorId') entrenadorId: number,
        @Body('equiposIds') equiposIds: string[],
        @Body('equipoSeleccionado') equipoSeleccionado: string
    ) {
        this.logger.log(`Creando equipo para el entrenador ${entrenadorId}`);
        return this.equipoEntrenadorService.crearEquipoEntrenador(entrenadorId, equiposIds, equipoSeleccionado);
    }

    @Get(':id')
    async obtenerEquipoEntrenador(@Param('id') id: string) {
        this.logger.log(`Obteniendo equipo de entrenador con ID: ${id}`);
        return this.equipoEntrenadorService.obtenerEquipoEntrenador(id);
    }

    @Get('entrenador/:entrenadorId')
    async obtenerEquiposPorEntrenador(@Param('entrenadorId') entrenadorId: string) {
        const numericId = parseInt(entrenadorId, 10);
        if (isNaN(numericId)) {
            throw new HttpException(`ID de entrenador inválido: ${entrenadorId}`, HttpStatus.BAD_REQUEST);
        }
        this.logger.log(`Obteniendo equipos del entrenador con ID: ${numericId}`);
        return this.equipoEntrenadorService.obtenerEquiposPorEntrenador(numericId);
    }

    @Put(':id')
    async actualizarEquipoEntrenador(
        @Param('id') id: string,
        @Body('entrenadorId') entrenadorId: number,
        @Body('equiposIds') equiposIds: string[],
        @Body('equipoSeleccionado') equipoSeleccionado: string
    ) {
        this.logger.log(`Actualizando equipo de entrenador con ID: ${id}`);
        return this.equipoEntrenadorService.actualizarEquipoEntrenador(id, entrenadorId, equiposIds, equipoSeleccionado);
    }

    @Delete(':id')
    async eliminarEquipoEntrenador(@Param('id') id: string) {
        this.logger.log(`Eliminando equipo de entrenador con ID: ${id}`);
        return this.equipoEntrenadorService.eliminarEquipoEntrenador(id);
    }
}

import { Controller, Get, Post, Put, Delete, Param, Body, Logger} from '@nestjs/common';
import { EquipoService } from '../services/equipo.service';

@Controller('api/equipos')
export class EquipoController {
    private readonly logger = new Logger(EquipoController.name);

    constructor(private readonly equipoService: EquipoService) { }

    @Post()
    async crearEquipo(
        @Body('entrenadorId') entrenadorId: string,
        @Body('nombre') nombre: string,
        @Body('pokemonIds') pokemonIds: number[]
    ) {
        this.logger.log(`Creando equipo "${nombre}" para el entrenador ${entrenadorId}`);
        return this.equipoService.crearEquipo(entrenadorId, nombre, pokemonIds);
    }

    @Get(':id')
    async obtenerEquipo(@Param('id') id: string) {
        this.logger.log(`Obteniendo equipo con ID: ${id}`);
        return this.equipoService.obtenerEquipo(id);
    }

    @Put(':id')
    async actualizarEquipo(
        @Param('id') id: string,
        @Body('nombre') nombre: string,
        @Body('pokemonIds') pokemonIds: number[]
    ) {
        this.logger.log(`Actualizando equipo con ID: ${id}`);
        return this.equipoService.actualizarEquipo(id, nombre, pokemonIds);
    }

    @Delete(':id')
    async eliminarEquipo(@Param('id') id: string) {
        this.logger.log(`Eliminando equipo con ID: ${id}`);
        return this.equipoService.eliminarEquipo(id);
    }
}

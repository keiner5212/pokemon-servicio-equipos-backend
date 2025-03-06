import { Controller, Get, Logger } from '@nestjs/common';
import { EntrenadorService } from '../services/entrenador.service';

/**
 * Controlador que maneja las rutas relacionadas con los Entrenadores
 * Expone los endpoints de la API REST para obtener información de Entrenadores
 */
@Controller('api')
export class EntrenadorController {
    private readonly logger = new Logger(EntrenadorController.name);

    /**
     * Constructor del controlador
     * @param entrenadorService - Servicio que maneja la lógica de negocio de Entrenadores
     */
    constructor(private readonly entrenadorService: EntrenadorService) {}

    /**
     * Endpoint que obtiene la lista completa de Entrenadores
     * @route GET /api/entrenadores
     * @returns Promise con un objeto que contiene el array de Entrenadores
     * @throws Error si hay problemas al obtener los datos
     */
    @Get('entrenadores')
    async obtenerEntrenadores() {
        try {
            this.logger.log('Procesando solicitud para obtener entrenadores');
            const response = await this.entrenadorService.obtenerEntrenadores();
            return response; // Devuelve la respuesta en formato JSON
        } catch (error) {
            this.logger.error(`Error al obtener entrenadores: ${error.message}`);
            throw error;
        }
    }
} 
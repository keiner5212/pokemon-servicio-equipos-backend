import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { EquipoPokemon } from '../models/equipo';
import { Pokemon } from '../models/pokemon.model';
import { PokemonService } from './pokemon.service';

@Injectable()
export class EquipoService {
    private equipos: Map<string, EquipoPokemon[]> = new Map();
    private readonly logger = new Logger(EquipoService.name);
    private readonly entrenadorServiceUrl = 'http://localhost:8000/api/entrenadores';

    constructor(
        private readonly httpService: HttpService,
        private readonly pokemonService: PokemonService
    ) {}

    private async getPokemonFromService(pokemonId: number): Promise<Pokemon> {
        try {
            const pokemon = await this.pokemonService.obtenerPokemonPorId(pokemonId);
            return pokemon;
        } catch (error) {
            console.error('Error al obtener Pokemon:', error.response?.data);
            throw new HttpException(
                `Pokemon con ID ${pokemonId} no encontrado`,
                HttpStatus.NOT_FOUND
            );
        }
    }

    private async getEntrenadorInfo(entrenadorId: string): Promise<any> {
        try {
            const numericId = parseInt(entrenadorId);
            if (isNaN(numericId)) {
                throw new HttpException('ID de entrenador inválido', HttpStatus.BAD_REQUEST);
            }

            // Obtener la lista completa de entrenadores
            const response = await firstValueFrom(
                this.httpService.get(this.entrenadorServiceUrl)
            );

            // Buscar el entrenador específico por ID
            const entrenador = response.data.entrenadores.find(e => e.id === numericId);
            if (!entrenador) {
                throw new HttpException('Entrenador no encontrado', HttpStatus.NOT_FOUND);
            }

            return entrenador;
        } catch (error) {
            console.error('Error al obtener entrenador:', error.response?.data);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Error al obtener información del entrenador', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private async verificarEntrenador(entrenadorId: string): Promise<boolean> {
        try {
            // Convertir el ID a número
            const numericId = parseInt(entrenadorId);
            if (isNaN(numericId)) {
                return false;
            }
            await firstValueFrom(this.httpService.get(`${this.entrenadorServiceUrl}/${numericId}`));
            return true;
        } catch (error) {
            return false;
        }
    }

    async crearEquipo(
        entrenadorId: string,
        nombre: string,
        pokemonIds: number[]
    ): Promise<any> {
        try {
            const numericId = parseInt(entrenadorId);
            if (isNaN(numericId)) {
                throw new HttpException('ID de entrenador inválido', HttpStatus.BAD_REQUEST);
            }

            // Obtener la lista de entrenadores y buscar el específico
            const listResponse = await firstValueFrom(this.httpService.get(this.entrenadorServiceUrl));
            const entrenadores: any[] = listResponse.data.entrenadores;
            const entrenador = entrenadores.find(e => Number(e.id) === numericId);
            
            if (!entrenador) {
                throw new HttpException('Entrenador no encontrado', HttpStatus.NOT_FOUND);
            }

            // Verificar límite de 6 Pokemon por equipo
            if (pokemonIds.length > 6) {
                throw new HttpException(
                    'Un equipo no puede tener más de 6 Pokemon',
                    HttpStatus.BAD_REQUEST
                );
            }

            // Obtener los Pokemon y verificar que existan
            try {
                const pokemones = await Promise.all(
                    pokemonIds.map(id => this.getPokemonFromService(id))
                );
                
                // Crear el equipo con ID numérico incremental basado en la cantidad de equipos existentes
                const equiposExistentes = this.equipos.get(entrenadorId) || [];
                const equipoId = equiposExistentes.length + 1;
                const equipo = new EquipoPokemon(equipoId, nombre, pokemones);

                // Obtener o inicializar la lista de equipos del entrenador
                equiposExistentes.push(equipo);
                this.equipos.set(entrenadorId, equiposExistentes);

                return {
                    entrenador,
                    equipos: equipo
                };
            } catch (error) {
                if (error instanceof HttpException) {
                    throw error;
                }
                throw new HttpException(
                    'Uno o más Pokemon no encontrados',
                    HttpStatus.NOT_FOUND
                );
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                `Error al crear equipo: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async obtenerEquipos(entrenadorId: string): Promise<any> {
        try {
            const numericId = parseInt(entrenadorId);
            if (isNaN(numericId)) {
                throw new HttpException('ID de entrenador inválido', HttpStatus.BAD_REQUEST);
            }

            const listResponse = await firstValueFrom(this.httpService.get(this.entrenadorServiceUrl));
            const entrenadores: any[] = listResponse.data.entrenadores;
            
            const entrenador = entrenadores.find(e => Number(e.id) === numericId);
            
            if (!entrenador) {
                throw new HttpException('Entrenador no encontrado', HttpStatus.NOT_FOUND);
            }

            const equipos = this.equipos.get(entrenadorId) || [];

            return {
                entrenador,
                equipos
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                `Error al obtener información del entrenador: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async obtenerEquipo(entrenadorId: string, equipoId: string): Promise<any> {
        try {
            const numericEntrenadorId = parseInt(entrenadorId);
            const numericEquipoId = parseInt(equipoId);
            
            if (isNaN(numericEntrenadorId) || isNaN(numericEquipoId)) {
                throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
            }

            const listResponse = await firstValueFrom(this.httpService.get(this.entrenadorServiceUrl));
            const entrenadores: any[] = listResponse.data.entrenadores;
            
            const entrenador = entrenadores.find(e => Number(e.id) === numericEntrenadorId);
            
            if (!entrenador) {
                throw new HttpException('Entrenador no encontrado', HttpStatus.NOT_FOUND);
            }

            const equipos = this.equipos.get(entrenadorId);
            if (!equipos) {
                return {
                    entrenador,
                    equipos: []
                };
            }

            const equipo = equipos.find(e => e.getId() === numericEquipoId);
            if (!equipo) {
                throw new HttpException('Equipo no encontrado', HttpStatus.NOT_FOUND);
            }

            return {
                entrenador,
                equipos: equipo
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                `Error al obtener información del entrenador: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async actualizarEquipo(
        entrenadorId: string,
        equipoId: string,
        nombre: string,
        pokemonIds: number[]
    ): Promise<any> {
        try {
            const numericEntrenadorId = parseInt(entrenadorId);
            const numericEquipoId = parseInt(equipoId);
            
            if (isNaN(numericEntrenadorId) || isNaN(numericEquipoId)) {
                throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
            }

            // Verificar cantidad de pokémon
            if (pokemonIds.length > 6) {
                throw new HttpException('Un equipo no puede tener más de 6 Pokémon', HttpStatus.BAD_REQUEST);
            }

            // Obtener información del entrenador
            const entrenador = await this.getEntrenadorInfo(entrenadorId);

            // Verificar y actualizar el equipo
            const equipos = this.equipos.get(entrenadorId);
            if (!equipos) {
                throw new HttpException('Equipos no encontrados para el entrenador', HttpStatus.NOT_FOUND);
            }

            const indiceEquipo = equipos.findIndex(e => e.getId() === numericEquipoId);
            if (indiceEquipo === -1) {
                throw new HttpException('Equipo no encontrado', HttpStatus.NOT_FOUND);
            }

            // Obtener los Pokemon y verificar que existan
            const pokemones = await Promise.all(
                pokemonIds.map(id => this.getPokemonFromService(id))
            );

            const equipoActualizado = new EquipoPokemon(numericEquipoId, nombre, pokemones);
            equipos[indiceEquipo] = equipoActualizado;

            return {
                entrenador,
                equipos: equipoActualizado
            };
        } catch (error) {
            console.error('Error al actualizar equipo:', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                `Error al actualizar equipo: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async eliminarEquipo(entrenadorId: string, equipoId: string): Promise<void> {
        // Verificar que el equipo existe
        await this.obtenerEquipo(entrenadorId, equipoId);

        const equipos = this.equipos.get(entrenadorId);
        if (equipos) {
            const indiceEquipo = equipos.findIndex(e => e.getId() === parseInt(equipoId));
            if (indiceEquipo !== -1) {
                equipos.splice(indiceEquipo, 1);
            }
        }
    }

    async obtenerTodosLosEntrenadores(): Promise<any[]> {
        try {
            console.log('Intentando obtener entrenadores de:', this.entrenadorServiceUrl);
            const response = await firstValueFrom(this.httpService.get(this.entrenadorServiceUrl));
            console.log('Respuesta del servicio de entrenadores:', response.data);
            
            // Extraer los entrenadores del objeto de respuesta
            const entrenadores: any[] = response.data.entrenadores || response.data;
            
            if (!Array.isArray(entrenadores)) {
                throw new Error('No se pudo obtener la lista de entrenadores');
            }

            return await Promise.all(entrenadores.map(async (entrenador) => {
                // Convertir el ID a string si viene como número
                const entrenadorId = entrenador.id.toString();
                const equiposEntrenador = this.equipos.get(entrenadorId) || [];
                return {
                    entrenador: {
                        id: entrenador.id,
                        nombre: entrenador.nombre,
                        edad: entrenador.edad,
                        sexo: entrenador.sexo
                    },
                    equipos: equiposEntrenador
                };
            }));
        } catch (error) {
            console.error('Error al obtener entrenadores:', error.message);
            if (error.response) {
                console.error('Detalles de la respuesta:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw new HttpException(
                `Error al obtener los entrenadores: ${error.message}`,
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}

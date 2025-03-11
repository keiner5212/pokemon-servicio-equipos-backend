import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { EquipoPokemon } from '../models/equipo';
import { Pokemon } from '../models/pokemon.model';
import { PokemonService } from './pokemon.service';
import { EntrenadorService } from './entrenador.service';

@Injectable()
export class EquipoService {
    private equipos: Map<string, EquipoPokemon[]> = new Map();
    private readonly logger = new Logger(EquipoService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly pokemonService: PokemonService,
        private readonly entrenadorService: EntrenadorService
    ) {
        this.logger.log('Servicio de equipos iniciado');
    }

    async crearEquipo(entrenadorId: string, nombre: string, pokemonIds: number[]): Promise<any> {
        try {
            // Verificar que el entrenador existe
            const entrenador = await this.entrenadorService.obtenerEntrenador(parseInt(entrenadorId));

            // Verificar límite de 6 Pokemon por equipo
            if (pokemonIds.length > 6) {
                throw new HttpException(
                    'Un equipo no puede tener más de 6 Pokemon',
                    HttpStatus.BAD_REQUEST
                );
            }

            // Obtener los Pokemon y verificar que existan
            const pokemones = await Promise.all(
                pokemonIds.map(id => this.pokemonService.obtenerPokemonPorId(id))
            );

            // Crear el equipo con ID numérico incremental
            const equiposExistentes = this.equipos.get(entrenadorId) || [];
            const equipoId = equiposExistentes.length + 1;
            const equipo = new EquipoPokemon(equipoId, nombre, pokemones);

            // Guardar el equipo
            equiposExistentes.push(equipo);
            this.equipos.set(entrenadorId, equiposExistentes);

            return {
                entrenador,
                equipo
            };
        } catch (error) {
            this.logger.error(`Error al crear equipo: ${error.message}`);
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
            // Verificar que el entrenador existe
            const entrenador = await this.entrenadorService.obtenerEntrenador(parseInt(entrenadorId));
            const equipos = this.equipos.get(entrenadorId) || [];

            return {
                entrenador,
                equipos
            };
        } catch (error) {
            this.logger.error(`Error al obtener equipos: ${error.message}`);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                `Error al obtener equipos: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async obtenerEquipo(entrenadorId: string, equipoId: string): Promise<any> {
        try {
            // Verificar que el entrenador existe
            const entrenador = await this.entrenadorService.obtenerEntrenador(parseInt(entrenadorId));
            
            const equipos = this.equipos.get(entrenadorId);
            if (!equipos) {
                return {
                    entrenador,
                    equipo: null
                };
            }

            const equipo = equipos.find(e => e.getId() === parseInt(equipoId));
            if (!equipo) {
                throw new HttpException('Equipo no encontrado', HttpStatus.NOT_FOUND);
            }

            return {
                entrenador,
                equipo
            };
        } catch (error) {
            this.logger.error(`Error al obtener equipo: ${error.message}`);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                `Error al obtener equipo: ${error.message}`,
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
            // Verificar que el entrenador existe
            const entrenador = await this.entrenadorService.obtenerEntrenador(parseInt(entrenadorId));

            // Verificar límite de 6 Pokemon
            if (pokemonIds.length > 6) {
                throw new HttpException(
                    'Un equipo no puede tener más de 6 Pokemon',
                    HttpStatus.BAD_REQUEST
                );
            }

            // Obtener y verificar el equipo existente
            const equipos = this.equipos.get(entrenadorId);
            if (!equipos) {
                throw new HttpException('Equipo no encontrado', HttpStatus.NOT_FOUND);
            }

            const indiceEquipo = equipos.findIndex(e => e.getId() === parseInt(equipoId));
            if (indiceEquipo === -1) {
                throw new HttpException('Equipo no encontrado', HttpStatus.NOT_FOUND);
            }

            // Obtener los Pokemon actualizados
            const pokemones = await Promise.all(
                pokemonIds.map(id => this.pokemonService.obtenerPokemonPorId(id))
            );

            // Actualizar el equipo
            const equipoActualizado = new EquipoPokemon(parseInt(equipoId), nombre, pokemones);
            equipos[indiceEquipo] = equipoActualizado;

            return {
                entrenador,
                equipo: equipoActualizado
            };
        } catch (error) {
            this.logger.error(`Error al actualizar equipo: ${error.message}`);
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
        try {
            // Verificar que el entrenador existe
            await this.entrenadorService.obtenerEntrenador(parseInt(entrenadorId));

            const equipos = this.equipos.get(entrenadorId);
            if (!equipos) {
                throw new HttpException('Equipo no encontrado', HttpStatus.NOT_FOUND);
            }

            const indiceEquipo = equipos.findIndex(e => e.getId() === parseInt(equipoId));
            if (indiceEquipo === -1) {
                throw new HttpException('Equipo no encontrado', HttpStatus.NOT_FOUND);
            }

            equipos.splice(indiceEquipo, 1);
        } catch (error) {
            this.logger.error(`Error al eliminar equipo: ${error.message}`);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                `Error al eliminar equipo: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async obtenerTodosLosEntrenadores(): Promise<any[]> {
        try {
            const { trainers } = await this.entrenadorService.obtenerEntrenadores();
            
            return await Promise.all(trainers.map(async (entrenador) => {
                const equiposEntrenador = this.equipos.get(entrenador.id) || [];
                return {
                    entrenador,
                    equipos: equiposEntrenador
                };
            }));
        } catch (error) {
            this.logger.error(`Error al obtener todos los entrenadores: ${error.message}`);
            throw new HttpException(
                `Error al obtener los entrenadores: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async eliminarPokemonDeEquipo(entrenadorId: string, equipoId: string, pokemonId: number): Promise<any> {
        try {
            // Verificar que el entrenador existe
            const entrenador = await this.entrenadorService.obtenerEntrenador(parseInt(entrenadorId));
            
            const equipos = this.equipos.get(entrenadorId);
            if (!equipos) {
                throw new HttpException('Equipo no encontrado', HttpStatus.NOT_FOUND);
            }

            const equipo = equipos.find(e => e.getId() === parseInt(equipoId));
            if (!equipo) {
                throw new HttpException('Equipo no encontrado', HttpStatus.NOT_FOUND);
            }

            // Obtener los pokémon actuales del equipo
            const pokemones = equipo.getPokemones();
            
            // Verificar que el pokémon existe en el equipo
            const pokemonIndex = pokemones.findIndex(p => p.getId() === pokemonId);
            if (pokemonIndex === -1) {
                throw new HttpException('Pokemon no encontrado en el equipo', HttpStatus.NOT_FOUND);
            }

            // Verificar que no sea el último pokémon del equipo
            if (pokemones.length <= 1) {
                throw new HttpException('No se puede eliminar el último Pokemon del equipo', HttpStatus.BAD_REQUEST);
            }

            // Eliminar el pokémon del equipo
            pokemones.splice(pokemonIndex, 1);
            
            // Crear un nuevo equipo con los pokémon actualizados
            const equipoActualizado = new EquipoPokemon(equipo.getId(), equipo.getNombre(), pokemones);
            
            // Actualizar el equipo en la lista
            const equipoIndex = equipos.findIndex(e => e.getId() === parseInt(equipoId));
            equipos[equipoIndex] = equipoActualizado;

            return {
                entrenador,
                equipo: equipoActualizado
            };
        } catch (error) {
            this.logger.error(`Error al eliminar Pokemon del equipo: ${error.message}`);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                `Error al eliminar Pokemon del equipo: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}

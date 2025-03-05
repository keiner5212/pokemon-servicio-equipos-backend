import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EquipoPokemon } from '../models/equipo-pokemon.model';
import { EntrenadorService } from './entrenador.service';
import { PokemonService } from './pokemon.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

/**
 * Servicio que gestiona las operaciones de Equipos Pokémon
 */
@Injectable()
export class EquipoPokemonService {
    private readonly logger = new Logger(EquipoPokemonService.name);
    private readonly apiUrl = 'https://run.mocky.io/v3/6d7aa16d-1386-4e50-9503-2901fdbbede6';
    private equipos: Map<number, EquipoPokemon> = new Map();

    constructor(
        private readonly entrenadorService: EntrenadorService,
        private readonly pokemonService: PokemonService,
        private readonly httpService: HttpService
    ) {
        this.cargarEquiposIniciales();
    }

    /**
     * Carga los equipos iniciales desde la API externa
     */
    private async cargarEquiposIniciales() {
        try {
            const { data } = await firstValueFrom(this.httpService.get(this.apiUrl));
            if (data && data.equipos) {
                data.equipos.forEach(equipo => {
                    const equipoPokemon = new EquipoPokemon(
                        equipo.entrenador,
                        equipo.pokemones
                    );
                    this.equipos.set(equipo.entrenador.id, equipoPokemon);
                });
                this.logger.log(`Se cargaron ${this.equipos.size} equipos iniciales`);
            }
        } catch (error) {
            this.logger.error('Error al cargar equipos iniciales:', error.message);
        }
    }

    /**
     * Obtiene el equipo Pokémon de un entrenador específico
     * @param entrenadorId - ID del entrenador
     * @returns Promise con el equipo Pokémon del entrenador
     * @throws NotFoundException si no se encuentra el equipo
     */
    async obtenerEquipoPorEntrenador(entrenadorId: number): Promise<EquipoPokemon> {
        const equipo = this.equipos.get(entrenadorId);
        if (!equipo) {
            throw new NotFoundException(`No se encontró equipo para el entrenador ${entrenadorId}`);
        }
        return equipo;
    }

    /**
     * Obtiene todos los equipos Pokémon registrados
     * @returns Promise con array de todos los equipos Pokémon
     */
    async obtenerTodosLosEquipos(): Promise<{ equipos: EquipoPokemon[] }> {
        return {
            equipos: Array.from(this.equipos.values())
        };
    }

    /**
     * Crea un nuevo equipo Pokémon para un entrenador
     * @param entrenadorId - ID del entrenador
     * @param pokemonIds - Array con los IDs de los Pokémon a agregar al equipo
     * @returns Promise con el equipo creado
     */
    async crearEquipo(entrenadorId: number, pokemonIds: number[]): Promise<EquipoPokemon> {
        this.logger.log(`Creando equipo para entrenador ${entrenadorId}`);

        if (this.equipos.has(entrenadorId)) {
            throw new Error(`El entrenador ${entrenadorId} ya tiene un equipo registrado`);
        }

        const { entrenadores } = await this.entrenadorService.obtenerEntrenadores();
        const entrenador = entrenadores.find(e => e['id'] === entrenadorId);
        if (!entrenador) {
            throw new NotFoundException(`No se encontró el entrenador ${entrenadorId}`);
        }

        const { pokemones } = await this.pokemonService.obtenerPokemones();
        const pokemonesEquipo = pokemonIds.map(id => {
            const pokemon = pokemones.find(p => p['id'] === id);
            if (!pokemon) {
                throw new NotFoundException(`No se encontró el pokemon ${id}`);
            }
            return pokemon;
        });

        const equipo = new EquipoPokemon(entrenador, pokemonesEquipo);
        this.equipos.set(entrenadorId, equipo);
        return equipo;
    }

    /**
     * Modifica el equipo Pokémon de un entrenador
     * @param entrenadorId - ID del entrenador
     * @param pokemonIds - Nuevos IDs de Pokémon para el equipo
     * @returns Promise con el equipo actualizado
     */
    async modificarEquipo(entrenadorId: number, pokemonIds: number[]): Promise<EquipoPokemon> {
        const equipoExistente = this.equipos.get(entrenadorId);
        if (!equipoExistente) {
            throw new NotFoundException(`No se encontró equipo para el entrenador ${entrenadorId}`);
        }

        const { pokemones } = await this.pokemonService.obtenerPokemones();
        const pokemonesEquipo = pokemonIds.map(id => {
            const pokemon = pokemones.find(p => p['id'] === id);
            if (!pokemon) {
                throw new NotFoundException(`No se encontró el pokemon ${id}`);
            }
            return pokemon;
        });

        const equipoActualizado = new EquipoPokemon(
            equipoExistente.getEntrenador(),
            pokemonesEquipo
        );

        this.equipos.set(entrenadorId, equipoActualizado);
        return equipoActualizado;
    }

    /**
     * Elimina el equipo Pokémon de un entrenador
     * @param entrenadorId - ID del entrenador
     * @returns boolean indicando si se eliminó el equipo
     */
    async eliminarEquipo(entrenadorId: number): Promise<boolean> {
        if (!this.equipos.has(entrenadorId)) {
            throw new NotFoundException(`No se encontró equipo para el entrenador ${entrenadorId}`);
        }
        return this.equipos.delete(entrenadorId);
    }
} 
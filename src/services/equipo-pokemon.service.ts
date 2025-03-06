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
    private equiposPorEntrenador: Map<number, number[]> = new Map();
    private ultimoId = 0;

    constructor(
        private readonly entrenadorService: EntrenadorService,
        private readonly pokemonService: PokemonService,
        private readonly httpService: HttpService
    ) {
        this.cargarEquiposIniciales();
    }

    /**
     * Genera un nuevo ID único para un equipo
     */
    private generarNuevoId(): number {
        return ++this.ultimoId;
    }

    /**
     * Carga los equipos iniciales desde la API externa
     */
    private async cargarEquiposIniciales() {
        try {
            const { data } = await firstValueFrom(this.httpService.get(this.apiUrl));
            if (data && data.equipos) {
                data.equipos.forEach(equipo => {
                    const equipoId = this.generarNuevoId();
                    const equipoPokemon = new EquipoPokemon(
                        equipoId,
                        equipo.entrenador,
                        equipo.pokemones
                    );
                    this.equipos.set(equipoId, equipoPokemon);
                    
                    // Agregar referencia al equipo en el mapa de entrenadores
                    const entrenadorId = equipo.entrenador.id;
                    if (!this.equiposPorEntrenador.has(entrenadorId)) {
                        this.equiposPorEntrenador.set(entrenadorId, []);
                    }
                    const equiposEntrenador = this.equiposPorEntrenador.get(entrenadorId);
                    if (equiposEntrenador) {
                        equiposEntrenador.push(equipoId);
                    }
                });
                this.logger.log(`Se cargaron ${this.equipos.size} equipos iniciales`);
            }
        } catch (error) {
            this.logger.error('Error al cargar equipos iniciales:', error.message);
        }
    }

    /**
     * Obtiene todos los equipos de un entrenador específico
     */
    async obtenerEquiposPorEntrenador(entrenadorId: number): Promise<{ equipos: EquipoPokemon[] }> {
        const equiposIds = this.equiposPorEntrenador.get(entrenadorId) || [];
        const equiposEntrenador = equiposIds
            .map(id => this.equipos.get(id))
            .filter(equipo => equipo !== undefined);

        if (equiposEntrenador.length === 0) {
            throw new NotFoundException(`No se encontraron equipos para el entrenador ${entrenadorId}`);
        }

        return { equipos: equiposEntrenador };
    }

    /**
     * Obtiene un equipo específico por su ID
     */
    async obtenerEquipoPorId(equipoId: number): Promise<EquipoPokemon> {
        const equipo = this.equipos.get(equipoId);
        if (!equipo) {
            throw new NotFoundException(`No se encontró el equipo con ID ${equipoId}`);
        }
        return equipo;
    }

    /**
     * Obtiene todos los equipos Pokémon registrados
     */
    async obtenerTodosLosEquipos(): Promise<{ equipos: EquipoPokemon[] }> {
        return {
            equipos: Array.from(this.equipos.values())
        };
    }

    /**
     * Crea un nuevo equipo Pokémon para un entrenador
     */
    async crearEquipo(entrenadorId: number, pokemonIds: number[]): Promise<EquipoPokemon> {
        this.logger.log(`Creando equipo para entrenador ${entrenadorId}`);

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

        const equipoId = this.generarNuevoId();
        const equipo = new EquipoPokemon(equipoId, entrenador, pokemonesEquipo);
        this.equipos.set(equipoId, equipo);

        // Agregar referencia al nuevo equipo
        if (!this.equiposPorEntrenador.has(entrenadorId)) {
            this.equiposPorEntrenador.set(entrenadorId, []);
        }
        const equiposEntrenador = this.equiposPorEntrenador.get(entrenadorId);
        if (equiposEntrenador) {
            equiposEntrenador.push(equipoId);
        }

        return equipo;
    }

    /**
     * Modifica un equipo Pokémon específico
     */
    async modificarEquipo(equipoId: number, pokemonIds: number[]): Promise<EquipoPokemon> {
        const equipoExistente = this.equipos.get(equipoId);
        if (!equipoExistente) {
            throw new NotFoundException(`No se encontró el equipo con ID ${equipoId}`);
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
            equipoId,
            equipoExistente.getEntrenador(),
            pokemonesEquipo
        );

        this.equipos.set(equipoId, equipoActualizado);
        return equipoActualizado;
    }

    /**
     * Elimina un equipo Pokémon específico
     */
    async eliminarEquipo(equipoId: number): Promise<boolean> {
        const equipo = this.equipos.get(equipoId);
        if (!equipo) {
            throw new NotFoundException(`No se encontró el equipo con ID ${equipoId}`);
        }

        // Eliminar referencia del equipo en el mapa de entrenadores
        const entrenadorId = equipo.getEntrenador()['id'];
        const equiposEntrenador = this.equiposPorEntrenador.get(entrenadorId) || [];
        this.equiposPorEntrenador.set(
            entrenadorId,
            equiposEntrenador.filter(id => id !== equipoId)
        );

        return this.equipos.delete(equipoId);
    }
} 
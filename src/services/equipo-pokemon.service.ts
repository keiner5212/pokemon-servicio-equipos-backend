import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EquipoPokemon } from '../models/equipo-pokemon.model';
import { EntrenadorService } from './entrenador.service';
import { PokemonService } from './pokemon.service';

/**
 * Servicio que gestiona las operaciones de Equipos Pokémon
 */
@Injectable()
export class EquipoPokemonService {
    private readonly logger = new Logger(EquipoPokemonService.name);
    private equipos: Map<number, EquipoPokemon> = new Map(); // Almacena los equipos por ID de entrenador

    constructor(
        private readonly entrenadorService: EntrenadorService,
        private readonly pokemonService: PokemonService
    ) {}

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
    async obtenerTodosLosEquipos(): Promise<EquipoPokemon[]> {
        return Array.from(this.equipos.values());
    }

    /**
     * Crea un nuevo equipo Pokémon para un entrenador
     * @param entrenadorId - ID del entrenador
     * @param pokemonIds - Array con los IDs de los Pokémon a agregar al equipo
     * @returns Promise con el equipo creado
     */
    async crearEquipo(entrenadorId: number, pokemonIds: number[]): Promise<EquipoPokemon> {
        this.logger.log(`Creando equipo para entrenador ${entrenadorId}`);

        // Obtener datos del entrenador
        const { entrenadores } = await this.entrenadorService.obtenerEntrenadores();
        const entrenador = entrenadores.find(e => e['id'] === entrenadorId);
        if (!entrenador) {
            throw new NotFoundException(`No se encontró el entrenador ${entrenadorId}`);
        }

        // Verificar si ya existe un equipo para este entrenador
        if (this.equipos.has(entrenadorId)) {
            throw new Error(`El entrenador ${entrenadorId} ya tiene un equipo registrado`);
        }

        // Obtener los pokemones
        const { pokemones } = await this.pokemonService.obtenerPokemones();
        const pokemonesEquipo = pokemonIds.map(id => {
            const pokemon = pokemones.find(p => p['id'] === id);
            if (!pokemon) {
                throw new NotFoundException(`No se encontró el pokemon ${id}`);
            }
            return pokemon;
        });

        // Crear el equipo
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
        // Verificar que el equipo existe
        const equipoExistente = this.equipos.get(entrenadorId);
        if (!equipoExistente) {
            throw new NotFoundException(`No se encontró equipo para el entrenador ${entrenadorId}`);
        }

        // Obtener los pokemones nuevos
        const { pokemones } = await this.pokemonService.obtenerPokemones();
        const pokemonesEquipo = pokemonIds.map(id => {
            const pokemon = pokemones.find(p => p['id'] === id);
            if (!pokemon) {
                throw new NotFoundException(`No se encontró el pokemon ${id}`);
            }
            return pokemon;
        });

        // Actualizar el equipo manteniendo el mismo entrenador
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
import { Pokemon } from './pokemon.model';
import { Entrenador } from './entrenador.model';

/**
 * Clase que representa un Equipo Pokémon
 * Contiene la información del entrenador y sus pokemones asignados
 */
export class EquipoPokemon {
    private readonly MAX_POKEMONES = 6;

    /**
     * Constructor que inicializa un nuevo Equipo Pokémon
     * @param id - Identificador único del equipo
     * @param entrenador - Datos del entrenador dueño del equipo
     * @param pokemones - Array de pokemones del equipo (máximo 6)
     * @throws Error si se intenta crear un equipo con más de 6 pokemones
     */
    constructor(
        private readonly id: number,
        private readonly entrenador: any,
        private readonly pokemones: any[]
    ) {
        if (pokemones.length > this.MAX_POKEMONES) {
            throw new Error(`Un equipo no puede tener más de ${this.MAX_POKEMONES} Pokémon`);
        }
    }

    /**
     * Obtiene el ID del equipo
     */
    getId(): number {
        return this.id;
    }

    /**
     * Agrega un pokemon al equipo
     * @param pokemon - Pokemon a agregar al equipo
     * @throws Error si el equipo ya tiene 6 pokemones
     */
    agregarPokemon(pokemon: Pokemon): void {
        if (this.pokemones.length >= this.MAX_POKEMONES) {
            throw new Error(`El equipo ya tiene el máximo de ${this.MAX_POKEMONES} pokemones`);
        }
        this.pokemones.push(pokemon);
    }

    /**
     * Elimina un pokemon del equipo por su ID
     * @param pokemonId - ID del pokemon a eliminar
     * @returns boolean - true si se eliminó el pokemon, false si no se encontró
     */
    eliminarPokemon(pokemonId: number): boolean {
        const indice = this.pokemones.findIndex(p => p['id'] === pokemonId);
        if (indice !== -1) {
            this.pokemones.splice(indice, 1);
            return true;
        }
        return false;
    }

    /**
     * Obtiene el entrenador del equipo
     */
    getEntrenador(): any {
        return this.entrenador;
    }

    /**
     * Obtiene la lista de pokemones del equipo
     */
    getPokemones(): any[] {
        return this.pokemones;
    }

    /**
     * Obtiene la cantidad actual de pokemones en el equipo
     */
    getCantidadPokemones(): number {
        return this.pokemones.length;
    }

    /**
     * Verifica si el equipo está lleno
     */
    estaLleno(): boolean {
        return this.pokemones.length >= this.MAX_POKEMONES;
    }

    /**
     * Serializa la instancia de EquipoPokemon a un objeto JSON
     */
    toJSON() {
        return {
            id: this.id,
            entrenador: this.entrenador,
            pokemones: this.pokemones
        };
    }
} 
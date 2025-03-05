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
     * @param entrenador - Datos del entrenador dueño del equipo
     * @param pokemones - Array de pokemones del equipo (máximo 6)
     * @throws Error si se intenta crear un equipo con más de 6 pokemones
     */
    constructor(
        private readonly entrenador: Entrenador,
        private pokemones: Pokemon[] = []
    ) {
        if (pokemones.length > this.MAX_POKEMONES) {
            throw new Error(`Un equipo no puede tener más de ${this.MAX_POKEMONES} pokemones`);
        }
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
     * Obtiene la cantidad actual de pokemones en el equipo
     * @returns number - Cantidad de pokemones en el equipo
     */
    getCantidadPokemones(): number {
        return this.pokemones.length;
    }

    /**
     * Verifica si el equipo está lleno (tiene 6 pokemones)
     * @returns boolean - true si el equipo está lleno, false si no
     */
    estaLleno(): boolean {
        return this.pokemones.length >= this.MAX_POKEMONES;
    }

    /**
     * Obtiene el entrenador del equipo
     * @returns Entrenador - Datos del entrenador
     */
    getEntrenador(): Entrenador {
        return this.entrenador;
    }

    /**
     * Obtiene la lista de pokemones del equipo
     * @returns Pokemon[] - Array con los pokemones del equipo
     */
    getPokemones(): Pokemon[] {
        return [...this.pokemones];
    }

    /**
     * Serializa la instancia de EquipoPokemon a un objeto JSON
     * @returns Objeto con los datos del equipo pokemon
     */
    toJSON() {
        return {
            entrenador: this.entrenador,        // Datos del entrenador
            pokemones: this.pokemones,          // Array de pokemones
            cantidad_pokemones: this.pokemones.length,  // Cantidad actual de pokemones
            equipo_completo: this.estaLleno()   // Indica si el equipo está lleno
        };
    }
} 
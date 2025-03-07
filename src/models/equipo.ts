import { Pokemon } from './pokemon.model';

/**
 * Clase que representa un equipo Pokémon en el sistema
 * Implementa un diseño inmutable donde todas las propiedades son privadas y de solo lectura
 */
export class EquipoPokemon {
    /**
     * Constructor que inicializa un nuevo equipo Pokémon
     * Todas las propiedades son privadas y de solo lectura para garantizar la inmutabilidad
     * @param id - Identificador único del equipo
     * @param nombre - Nombre del equipo
     * @param pokemones - Array de Pokémon que conforman el equipo (máximo 6)
     */
    constructor(
        private readonly id: number,
        private readonly nombre: string,
        private readonly pokemones: Pokemon[] = []
    ) {
        if (pokemones.length > 6) {
            throw new Error('Un equipo no puede tener más de 6 Pokémon');
        }
    }

    /**
     * Obtiene el ID único del equipo
     * @returns number - ID del equipo
     */
    getId(): number {
        return this.id;
    }

    /**
     * Obtiene el nombre del equipo
     * @returns string - Nombre del equipo
     */
    getNombre(): string {
        return this.nombre;
    }

    /**
     * Obtiene la lista de Pokémon del equipo
     * @returns Pokemon[] - Array con los Pokémon del equipo
     * Retorna una copia del array para evitar modificaciones externas
     */
    getPokemones(): Pokemon[] {
        return [...this.pokemones];
    }

    /**
     * Crea un nuevo equipo con un Pokémon adicional
     * @param pokemon - Pokémon a agregar al equipo
     * @returns EquipoPokemon - Nuevo equipo con el Pokémon agregado
     * @throws Error si el equipo ya tiene 6 Pokémon
     */
    agregarPokemon(pokemon: Pokemon): EquipoPokemon {
        if (this.pokemones.length >= 6) {
            throw new Error('El equipo ya tiene el máximo de 6 Pokémon');
        }
        return new EquipoPokemon(
            this.id,
            this.nombre,
            [...this.pokemones, pokemon]
        );
    }

    /**
     * Crea un nuevo equipo sin el Pokémon especificado
     * @param pokemonId - ID del Pokémon a eliminar
     * @returns EquipoPokemon - Nuevo equipo sin el Pokémon especificado
     */
    eliminarPokemon(pokemonId: number): EquipoPokemon {
        const nuevoPokemones = this.pokemones.filter(p => p.getId() !== pokemonId);
        return new EquipoPokemon(
            this.id,
            this.nombre,
            nuevoPokemones
        );
    }

    /**
     * Busca un Pokémon específico en el equipo
     * @param pokemonId - ID del Pokémon a buscar
     * @returns Pokemon | undefined - El Pokémon encontrado o undefined si no existe
     */
    obtenerPokemon(pokemonId: number): Pokemon | undefined {
        return this.pokemones.find(p => p.getId() === pokemonId);
    }

    /**
     * Serializa la instancia de EquipoPokemon a un objeto JSON
     * Este método es llamado automáticamente por NestJS cuando necesita convertir
     * el objeto EquipoPokemon a JSON en la respuesta HTTP
     * @returns Object - Objeto plano con todas las propiedades del equipo
     */
    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            pokemones: this.pokemones
        };
    }
}

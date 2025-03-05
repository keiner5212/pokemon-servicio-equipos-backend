/**
 * Clase que representa la estructura de un Pokémon en el sistema
 * Implementa un diseño inmutable donde todas las propiedades son privadas y de solo lectura
 */
export class Pokemon {
    /**
     * Constructor que inicializa un nuevo Pokémon con todos sus atributos
     * Todas las propiedades son privadas y de solo lectura para garantizar la inmutabilidad
     * @param id - Identificador único del Pokémon
     * @param nombre - Nombre del Pokémon
     * @param tipos - Array con los tipos del Pokémon (ej: ["Fuego", "Volador"])
     * @param nivel - Nivel actual del Pokémon
     * @param estadisticas - Objeto con las estadísticas base del Pokémon
     * @param movimientos - Lista de movimientos que puede realizar el Pokémon
     * @param sprite - URL de la imagen del Pokémon
     */
    constructor(
        private readonly id: number,          // Identificador único del Pokémon
        private readonly nombre: string,      // Nombre del Pokémon
        private readonly tipos: string[],     // Array con los tipos del Pokémon (ej: ["Fuego", "Volador"])
        private readonly nivel: number,       // Nivel actual del Pokémon
        private readonly estadisticas: {      // Objeto con las estadísticas base
            hp: number,              // Puntos de vida
            ataque: number,          // Poder de ataque físico
            defensa: number,         // Capacidad de defensa física
            ataque_especial: number, // Poder de ataque especial
            defensa_especial: number,// Capacidad de defensa especial
            velocidad: number        // Velocidad del Pokémon
        },
        private readonly movimientos: string[], // Lista de movimientos disponibles
        private readonly sprite: string     // Agregamos el sprite
    ) {}

    /**
     * Obtiene el ID único del Pokémon
     * @returns number - ID del Pokémon
     */
    getId(): number {
        return this.id;
    }

    /**
     * Obtiene el nombre del Pokémon
     * @returns string - Nombre del Pokémon
     */
    getNombre(): string {
        return this.nombre;
    }

    /**
     * Obtiene los tipos del Pokémon
     * @returns string[] - Array con los tipos del Pokémon
     * Retorna una copia del array para evitar modificaciones externas
     */
    getTipos(): string[] {
        return [...this.tipos];
    }

    /**
     * Obtiene el nivel actual del Pokémon
     * @returns number - Nivel del Pokémon
     */
    getNivel(): number {
        return this.nivel;
    }

    /**
     * Obtiene las estadísticas del Pokémon
     * @returns Object - Objeto con todas las estadísticas base
     * Retorna una copia del objeto para evitar modificaciones externas
     */
    getEstadisticas(): {
        hp: number,
        ataque: number,
        defensa: number,
        ataque_especial: number,
        defensa_especial: number,
        velocidad: number
    } {
        return {...this.estadisticas};
    }

    /**
     * Obtiene la lista de movimientos del Pokémon
     * @returns string[] - Array con los nombres de los movimientos
     * Retorna una copia del array para evitar modificaciones externas
     */
    getMovimientos(): string[] {
        return [...this.movimientos];
    }

    /**
     * Obtiene la URL de la imagen del Pokémon
     * @returns string - URL del sprite del Pokémon
     */
    getSprite(): string {
        return this.sprite;
    }

    /**
     * Serializa la instancia de Pokemon a un objeto JSON
     * Este método es llamado automáticamente por NestJS cuando necesita convertir
     * el objeto Pokemon a JSON en la respuesta HTTP
     * @returns Object - Objeto plano con todas las propiedades del Pokemon
     */
    toJSON() {
        return {
            id: this.id,                    // ID único del Pokemon
            nombre: this.nombre,            // Nombre del Pokemon
            tipos: this.tipos,              // Array con los tipos del Pokemon
            nivel: this.nivel,              // Nivel actual del Pokemon
            estadisticas: this.estadisticas,// Objeto con las estadísticas
            movimientos: this.movimientos,  // Array de movimientos disponibles
            sprite: this.sprite             // URL de la imagen del Pokemon
        };
    }
} 
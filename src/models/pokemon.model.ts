// Clase que representa la estructura de un Pokémon
export class Pokemon {
    constructor(
        // Propiedades privadas y de solo lectura para garantizar la inmutabilidad
        private readonly id: number,          // Identificador único del Pokémon
        private readonly nombre: string,      // Nombre del Pokémon
        private readonly tipos: string[],     // Array con los tipos del Pokémon (ej: ["Fuego", "Volador"])
        private readonly nivel: number,       // Nivel actual del Pokémon
        private readonly estadisticas: {      // Objeto con las estadísticas base
            hp: number,
            ataque: number,
            defensa: number,
            ataqueEspecial: number,
            defensaEspecial: number,
            velocidad: number
        },
        private readonly movimientos: string[] // Lista de movimientos disponibles
    ) {}

    // Métodos getter para acceder a las propiedades privadas
    getId(): number {
        return this.id;
    }

    getNombre(): string {
        return this.nombre;
    }

    // Retorna una copia del array para evitar modificaciones externas
    getTipos(): string[] {
        return [...this.tipos];
    }

    getNivel(): number {
        return this.nivel;
    }

    // Retorna una copia del objeto para evitar modificaciones externas
    getEstadisticas(): {
        hp: number,
        ataque: number,
        defensa: number,
        ataqueEspecial: number,
        defensaEspecial: number,
        velocidad: number
    } {
        return {...this.estadisticas};
    }

    // Retorna una copia del array para evitar modificaciones externas
    getMovimientos(): string[] {
        return [...this.movimientos];
    }
} 
/**
 * Clase que representa a un Entrenador Pokémon
 * Contiene la información básica de un entrenador
 */
export class Entrenador {
    /**
     * Constructor que inicializa un nuevo Entrenador
     * @param id - Identificador único del entrenador
     * @param nombre - Nombre completo del entrenador
     * @param edad - Edad del entrenador
     * @param sexo - Género del entrenador (Masculino/Femenino)
     */
    constructor(
        private readonly id: number,
        private readonly nombre: string,
        private readonly edad: number,
        private readonly sexo: string
    ) {}

    /**
     * Serializa la instancia de Entrenador a un objeto JSON
     * @returns Objeto plano con las propiedades del Entrenador
     */
    toJSON() {
        return {
            id: this.id,         // ID único del entrenador
            nombre: this.nombre, // Nombre del entrenador
            edad: this.edad,     // Edad del entrenador
            sexo: this.sexo      // Género del entrenador
        };
    }
} 
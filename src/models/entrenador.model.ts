/**
 * Clase que representa a un Entrenador Pokémon
 * Contiene la información básica de un entrenador
 */
export class Entrenador {
    /**
     * Constructor que inicializa un nuevo Entrenador
     * @param id - Identificador único del entrenador
     * @param birth_date - Fecha de nacimiento del entrenador
     * @param email - Correo electrónico del entrenador
     * @param first_name - Nombre del entrenador
     * @param last_name - Apellido del entrenador
     */
    constructor(
        public id: string,
        public birth_date: string,
        public email: string,
        public first_name: string,
        public last_name: string
    ) {}

    /**
     * Serializa la instancia de Entrenador a un objeto JSON
     * @returns Objeto plano con las propiedades del Entrenador
     */
    toJSON() {
        return {
            id: this.id,         // ID único del entrenador
            birth_date: this.birth_date, // Fecha de nacimiento del entrenador
            email: this.email,     // Correo electrónico del entrenador
            first_name: this.first_name, // Nombre del entrenador
            last_name: this.last_name      // Apellido del entrenador
        };
    }
} 
import { serverTimestamp } from "firebase/firestore";

export class EquipoEntrenador {
    constructor(
        private readonly id: string,
        private readonly entrenadorId: number,
        private readonly equiposIds: string[],
        private readonly equipoSeleccionado: string
    ) {
    }

    toJSON() {
        return {
            id: this.id,
            entrenadorId: this.entrenadorId,
            equipos: this.equiposIds,
            equipoSeleccionado: this.equipoSeleccionado
        };
    }

    getUpdateJson() {
        const timestamp = serverTimestamp()
        return {
            entrenadorId: this.entrenadorId,
            equiposIds: this.equiposIds,
            equipoSeleccionado: this.equipoSeleccionado,
            updatedAt: timestamp
        };
    }
}


export class ToSaveEquipoEntrenador {
    constructor(
        private readonly entrenadorId: number,
        private readonly equiposIds: string[],
        private readonly equipoSeleccionado: string
    ) {
    }

    getSaveJson() {
        const timestamp = serverTimestamp()
        return {
            entrenadorId: this.entrenadorId,
            equiposIds: this.equiposIds,
            equipoSeleccionado: this.equipoSeleccionado,
            createdAt: timestamp,
            updatedAt: timestamp,
        };
    }
}
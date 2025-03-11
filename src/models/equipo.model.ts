import { serverTimestamp } from "firebase/firestore";

export class EquipoPokemon {
    constructor(
        private readonly id: string,
        private readonly nombre: string,
        private readonly pokemonesIds: number[] = []
    ) {
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            pokemonesIds: this.pokemonesIds
        };
    }

    getUpdateJson() {
        const timestamp=serverTimestamp()
        return {
            nombre: this.nombre,
            pokemonesIds: this.pokemonesIds,
            updatedAt: timestamp
        };
    }
}


export class ToSaveEquipoPokemon {
    constructor(
        public nombre: string,
        public pokemonesIds: number[] = []
    ) {
        if (pokemonesIds.length > 6) {
            throw new Error('Un equipo no puede tener más de 6 Pokémon');
        }
    }

    getSaveJson() {
        const timestamp=serverTimestamp()
        return {
            nombre: this.nombre,
            pokemonesIds: this.pokemonesIds,
            createdAt: timestamp,
            updatedAt: timestamp,
        };
    }
}
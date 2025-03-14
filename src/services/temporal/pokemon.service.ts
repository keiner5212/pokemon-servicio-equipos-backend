import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

/*
    simula el servicio que tendremos de pokemones
 */
@Injectable()
export class PokemonService {
    private readonly logger = new Logger(PokemonService.name);
    private pokemones: any[] = [];

    constructor(
        private readonly httpService: HttpService
    ) {
        const url="https://run.mocky.io/v3/80b8134b-409a-4d85-bb3c-52a4a5548c36"
        // Cargar los Pokemon al iniciar el servicio
        this.cargarPokemones(url);
    }

    private async cargarPokemones(url: string): Promise<void> {
        try {
            const { data } = await firstValueFrom(
                this.httpService.get(url)
            );

            if (!data || !data.pokemones || !Array.isArray(data.pokemones)) {
                throw new Error('Formato de respuesta inválido');
            }

            this.pokemones = data.pokemones;

            this.logger.log(`${this.pokemones.length} Pokemon cargados correctamente`);
        } catch (error) {
            this.logger.error('Error al cargar Pokemon:', error);
            throw new HttpException(
                'Error al cargar la base de datos de Pokemon',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    obtenerPokemones(): { pokemones: any[] } {
        return { pokemones: this.pokemones };
    }

    obtenerPokemonPorId(id: number): any {
        const pokemon = this.pokemones.find(p => p.id === id);

        if (!pokemon) {
            throw new HttpException(
                `Pokemon con ID ${id} no encontrado`,
                HttpStatus.NOT_FOUND
            );
        }

        return pokemon;
    }
}
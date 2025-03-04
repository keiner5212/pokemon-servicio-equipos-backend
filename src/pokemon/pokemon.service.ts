import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Pokemon } from './pokemon.interface';

@Injectable()
export class PokemonService {
    private readonly apiUrl = 'https://pokeapi.co/api/v2/pokemon';

    constructor(private readonly httpService: HttpService) {}

    async getAllPokemon(limit: number = 20): Promise<Pokemon[]> {
        try {
          // 1. Obtener la lista de Pokémon
            const { data } = await firstValueFrom(
                this.httpService.get('https://pokeapi.co/api/v2/pokemon', {
                    params: { limit },
                })
            );
      
          // 2. Obtener detalles de cada Pokémon en y mapear
        return Promise.all(
            data.results.map(async (pokemon) => {
              const { data } = await firstValueFrom(this.httpService.get(pokemon.url));
              return this.mapToPokemonInterface(data);
            })
        );
        } catch (error) {
          console.error('Error fetching Pokémon:', error.message);
          throw new Error('Failed to fetch Pokémon data.');
        }
    }

    async getPokemonByName(name: string): Promise<Pokemon> {
        const { data } = await firstValueFrom(
            this.httpService.get(`${this.apiUrl}/${name.toLowerCase()}`)
        );
        return this.mapToPokemonInterface(data);
    }

    private mapToPokemonInterface(data: any): Pokemon {
        return {
            id: data.id,
            name: data.name,
            types: data.types.map((type) => type.type.name),
            imageUrl: data.sprites.front_default,
        };
    }
}
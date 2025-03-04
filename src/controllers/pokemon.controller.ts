import { Controller, Get, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PokemonService } from '../services/pokemon.service';
import { Pokemon } from '../models/pokemon.model';

@Controller('api/pokemones')
export class PokemonController {
    private readonly logger = new Logger(PokemonController.name);

    constructor(private readonly pokemonService: PokemonService) {}

    @Get()
    async obtenerPokemones() {
        this.logger.log('Petición recibida para obtener pokemones');
        try {
            const pokemon = await this.pokemonService.obtenerPokemon();
            this.logger.log('Pokemones obtenidos exitosamente');
            return pokemon;
        } catch (error) {
            this.logger.error(`Error al obtener pokemones: ${error.message}`);
            throw new HttpException(
                'Error al obtener pokemones',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
} 
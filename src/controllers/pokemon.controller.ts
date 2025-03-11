import { Controller, Get, Logger, Param, HttpException, HttpStatus } from '@nestjs/common';
import { PokemonService } from '../services/temporal/pokemon.service';

// NOTA: tanto como el PokemonService como este controlador deben ser eliminados cuando ya se tengan los servicios reales
@Controller('api/pokemon')
export class PokemonController {
    private readonly logger = new Logger(PokemonController.name);

    constructor(private readonly pokemonService: PokemonService) { }

    @Get()
    obtenerPokemones() {
        this.logger.log('Procesando solicitud para obtener pokemones');
        return this.pokemonService.obtenerPokemones();
    }

    @Get(':id')
    obtenerPokemonPorId(@Param('id') id: string) {
        this.logger.log(`Procesando solicitud para obtener pokemon con ID: ${id}`);

        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
            throw new HttpException(`ID de Pokémon inválido: ${id}`, HttpStatus.BAD_REQUEST);
        }

        return this.pokemonService.obtenerPokemonPorId(numericId);
    }
}

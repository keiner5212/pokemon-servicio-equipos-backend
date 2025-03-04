import { Controller, Get } from "@nestjs/common";
import { PokemonService } from "./pokemon.service";

@Controller('pokemon')
export class PokemonController {

    constructor(private pokemonService: PokemonService) {}

    @Get('/')
    getAllPokemon() {
        return this.pokemonService.getAllPokemon(26);
    }


}
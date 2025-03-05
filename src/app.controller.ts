import { Controller, Get, Logger } from "@nestjs/common";
import { AppService } from "./app.service";
import { PokemonService } from './services/pokemon.service';
import { Pokemon } from './models/pokemon.model';

@Controller('api')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly pokemonService: PokemonService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('pokemones')
  async getPokemon(): Promise<{ pokemones: Pokemon[] }> {
    this.logger.log('Recibida petición GET /api/pokemones');
    try {
      const pokemon = await this.pokemonService.obtenerPokemones();
      this.logger.log('Pokémon obtenido correctamente');
      return pokemon;
    } catch (error) {
      this.logger.error(`Error al obtener pokémon: ${error.message}`);
      throw error;
    }
  }
}

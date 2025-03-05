import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoggerMiddleware } from "./middlewares/RequestLogger";
import { FirebaseModule } from "./modules/services/firebase/firebase.module";
import { HttpModule } from '@nestjs/axios';
import { PokemonService } from './services/pokemon.service';
import { PokemonController } from './controllers/pokemon.controller';
import { EntrenadorController } from './controllers/entrenador.controller';
import { EntrenadorService } from './services/entrenador.service';
import { EquipoPokemonController } from './controllers/equipo-pokemon.controller';
import { EquipoPokemonService } from './services/equipo-pokemon.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirebaseModule,
    HttpModule
  ],
  controllers: [
    AppController,
    PokemonController,
    EntrenadorController,
    EquipoPokemonController
  ],
  providers: [
    AppService,
    PokemonService,
    EntrenadorService,
    EquipoPokemonService
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

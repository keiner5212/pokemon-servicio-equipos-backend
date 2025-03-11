import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoggerMiddleware } from "./middlewares/RequestLogger";
import { FirebaseModule } from "./modules/services/firebase/firebase.module";
import { HttpModule } from '@nestjs/axios';
import { PokemonService } from './services/temporal/pokemon.service';
import { PokemonController } from './controllers/pokemon.controller';
import { EntrenadorController } from './controllers/entrenador.controller';
import { EntrenadorService } from './services/temporal/entrenador.service';
import { EquipoService } from './services/equipo.service';
import { EquipoEntrenadorController } from "./controllers/equipo-entrenador.controller";
import { EquipoController } from "./controllers/equipo.controller";

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
    EquipoEntrenadorController,
    EquipoController
  ],
  providers: [
    AppService,
    PokemonService,
    EntrenadorService,
    EquipoService,
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Config } from "./modules/enviroment/Config";

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: "INIT_CONFIG",
      useFactory: (configService: ConfigService) => {
        Config.init(configService);
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule { }

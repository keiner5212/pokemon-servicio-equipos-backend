import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoggerMiddleware } from "./middlewares/RequestLogger";
import { FirebaseModule } from "./modules/services/firebase/firebase.module";

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), FirebaseModule],
  controllers: [AppController],
  providers: [
    AppService
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

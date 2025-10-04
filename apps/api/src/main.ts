import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const origins = [process.env.WEB_ORIGIN, process.env.EXPO_WEB_ORIGIN].filter(
    Boolean,
  ) as string[];
  app.enableCors({ origin: origins, credentials: false });

  const port = Number(process.env.API_PORT ?? 3000);
  await app.listen(port);
  console.log("CORS origins:", origins);
}
bootstrap();

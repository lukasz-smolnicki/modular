import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const origin = process.env.WEB_ORIGIN ?? 'http://localhost:5173';
    app.enableCors({ origin, credentials: false });

    const port = Number(process.env.API_PORT ?? 3000);
    await app.listen(port);
}
bootstrap();

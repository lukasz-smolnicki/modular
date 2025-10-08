import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function buildOriginPredicate() {
    const exacts = [
        process.env.WEB_ORIGIN || process.env.WEB_DEV_URL,
        process.env.EXPO_WEB_ORIGIN || process.env.MOBILE_WEB_DEV_URL
    ].filter(Boolean) as string[];

    const regexes: RegExp[] = [
        process.env.WEB_ORIGIN_REGEX,
        process.env.EXPO_WEB_ORIGIN_REGEX
    ]
        .filter(Boolean)
        .map((r) => {
            try {
                return new RegExp(r as string);
            } catch {
                return null;
            }
        })
        .filter((r): r is RegExp => !!r);

    return (
        origin: string | undefined,
        cb: (err: Error | null, allow?: boolean) => void
    ) => {
        if (!origin) return cb(null, true);
        if (exacts.includes(origin)) return cb(null, true);
        if (regexes.some((rx) => rx.test(origin))) return cb(null, true);
        cb(null, false);
    };
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: buildOriginPredicate(),
        credentials: false
    });

    const port = Number(process.env.API_PORT ?? 3000);
    await app.listen(port);
}
bootstrap();

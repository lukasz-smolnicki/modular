import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

function buildOriginPredicate() {
  const exacts = [
    process.env.WEB_ORIGIN || process.env.WEB_DEV_URL,
    process.env.EXPO_WEB_ORIGIN || process.env.MOBILE_WEB_DEV_URL,
  ].filter((v): v is string => Boolean(v));

  const regexStrings = [
    process.env.WEB_ORIGIN_REGEX,
    process.env.EXPO_WEB_ORIGIN_REGEX,
  ].filter((v): v is string => Boolean(v));

  const regexes = regexStrings
    .map((s): RegExp | null => {
      try {
        return new RegExp(s);
      } catch {
        return null;
      }
    })
    .filter((r): r is RegExp => r !== null);

  return (
    origin: string | undefined,
    cb: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (!origin) return cb(null, true);
    if (exacts.includes(origin)) return cb(null, true);
    if (regexes.some((re) => re.test(origin))) return cb(null, true);
    return cb(null, false);
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const origin = buildOriginPredicate();
  app.enableCors({ origin, credentials: false });
  const port = Number(process.env.API_PORT ?? 3000);
  await app.listen(port);
}
bootstrap();

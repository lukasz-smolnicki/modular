import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../src/app.module";

const BASE = process.env.API_BASE_URL;

describe("Health API e2e", () => {
  let app: INestApplication | undefined;

  beforeAll(async () => {
    if (!BASE) {
      const mod = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
      app = mod.createNestApplication();
      await app.init();
    }
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it("GET /health/api -> Witamy z API", async () => {
    const agent = BASE ? request(BASE) : request(app!.getHttpServer());
    const res = await agent.get("/health/api").expect(200);
    expect(res.body?.message).toBe("Witamy z API");
  });
});

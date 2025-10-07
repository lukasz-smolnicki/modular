import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../src/app.module";

jest.setTimeout(15000);

const BASE = process.env.API_BASE_URL;

describe("Health Firestore e2e", () => {
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

  it("GET /health/firestore -> Witamy z FIRESTORE", async () => {
    const agent = BASE ? request(BASE) : request(app!.getHttpServer());
    const res = await agent.get("/health/firestore").expect(200);
    expect(res.body?.message).toBe("Witamy z FIRESTORE");
  });
});

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Health API e2e', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const mod = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();
        app = mod.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /health/api -> Witamy z API', async () => {
        const res = await request(app.getHttpServer())
            .get('/health/api')
            .expect(200);
        expect(res.body?.message).toBe('Witamy z API');
    });
});

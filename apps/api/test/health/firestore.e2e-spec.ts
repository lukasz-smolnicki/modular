import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

jest.setTimeout(15000);

describe('Health Firestore e2e', () => {
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

    it('GET /health/firestore -> Witamy z FIRESTORE', async () => {
        const res = await request(app.getHttpServer())
            .get('/health/firestore')
            .expect(200);
        expect(res.body?.message).toBe('Witamy z FIRESTORE');
    });
});

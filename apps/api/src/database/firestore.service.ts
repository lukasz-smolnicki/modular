import { Injectable, NotFoundException } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';

@Injectable()
export class FirestoreService {
    private db = new Firestore();

    async getHealthMessage(): Promise<string> {
        const snap = await this.db.doc('health/firebase').get();
        if (!snap.exists)
            throw new NotFoundException('Brak dokumentu health/firebase');
        const data = snap.data() as { message?: string } | undefined;
        if (!data?.message) throw new NotFoundException('Brak pola "message"');
        return data.message;
    }
}

import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('firestore')
export class FirestoreController {
  @Get()
  @HttpCode(501)
  notImplemented() {
    return { error: 'Not implemented yet (Firestore w kolejnym kroku)' };
  }
}

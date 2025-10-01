import { Controller, Get, Header } from "@nestjs/common";
import { FirestoreMsgService } from "./firestore.service";

@Controller("firestore")
export class FirestoreController {
  constructor(private readonly msgs: FirestoreMsgService) {}

  @Get()
  @Header("Content-Type", "text/plain; charset=utf-8")
  async get(): Promise<string> {
    return this.msgs.getWelcome();
  }
}

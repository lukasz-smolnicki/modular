import { Injectable } from "@nestjs/common";

@Injectable()
export class ApiService {
  getMessage(): string {
    return "Witamy z API";
  }
}

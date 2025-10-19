import { Controller, Get, Query } from "@nestjs/common";
import { RegistryService } from "./registry.service";

@Controller("modules/registry")
export class RegistryController {
  constructor(private readonly svc: RegistryService) {}

  @Get("public")
  async listPublic() {
    return this.svc.listPublic();
  }

  @Get("visible")
  async listVisible(@Query("uid") uid?: string) {
    return this.svc.listVisible(uid);
  }
}

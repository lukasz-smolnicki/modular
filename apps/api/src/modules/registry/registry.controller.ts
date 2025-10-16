import { Controller, Get } from "@nestjs/common";
import { RegistryService } from "./registry.service";
import type { Modules } from "@modular/types";

@Controller("modules/registry")
export class RegistryController {
  constructor(private readonly svc: RegistryService) {}

  @Get("public")
  async listPublic(): Promise<Modules.ModuleInfo[]> {
    return this.svc.listPublic();
  }
}

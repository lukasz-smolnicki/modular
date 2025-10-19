import { Controller, Get, Headers } from "@nestjs/common";
import { UsersService } from "./users.service";
import type { Users } from "@modular/types";

function resolveUserIdFromHeaders(
  h: Record<string, string | string[] | undefined>,
) {
  const raw =
    (h["x-user-id"] as string | undefined) ||
    (h["X-User-Id"] as string | undefined);
  return raw?.trim() || "demo-user-1";
}

@Controller("users")
export class UsersController {
  constructor(private readonly svc: UsersService) {}

  @Get("me/modules")
  async meModules(@Headers() headers: Record<string, string>) {
    const userId = resolveUserIdFromHeaders(headers);
    const enabled = await this.svc.getEnabledMap(userId);
    return Object.entries(enabled).map(
      ([key, role]) =>
        ({ key, role }) as { key: string; role: Users.ModuleRole },
    );
  }
}

import { getConfig } from "@/runtime/config";

type GetInit = Omit<RequestInit, "body" | "method">;
type PostInit = Omit<RequestInit, "body" | "method"> & {
  headers?: HeadersInit;
};

function buildUrl(path: string) {
  const base = getConfig().API_BASE_URL?.replace(/\/+$/, "") ?? "";
  const p = path.replace(/^\/+/, "");
  return `${base}/${p}`;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return undefined as unknown as T;
  return (await res.json()) as T;
}

export async function apiGet<T>(path: string, init?: GetInit) {
  const res = await fetch(buildUrl(path), { method: "GET", ...(init ?? {}) });
  return handle<T>(res);
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  init?: PostInit,
) {
  const res = await fetch(buildUrl(path), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    body: body != null ? JSON.stringify(body) : undefined,
    ...(init ?? {}),
  });
  return handle<T>(res);
}

const base = process.env.API_REMOTE_BASE as string;

describe("Remote Health (Cloud Run)", () => {
  it("GET /health/api -> Witamy z API", async () => {
    const r = await fetch(`${base}/health/api`);
    expect(r.status).toBe(200);
    const json = (await r.json()) as { message?: string };
    expect(json?.message).toBe("Witamy z API");
  });

  it("GET /health/firestore -> Witamy z FIRESTORE", async () => {
    const r = await fetch(`${base}/health/firestore`);
    expect(r.status).toBe(200);
    const json = (await r.json()) as { message?: string };
    expect(json?.message).toBe("Witamy z FIRESTORE");
  });
});

describe("Remote Health (Cloud Run)", () => {
  const base = process.env.API_DEV_URL as string;

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

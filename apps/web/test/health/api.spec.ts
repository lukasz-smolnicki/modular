import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  page.on("console", (msg) => {
    console.log(`[console:${msg.type()}] ${msg.text()}`);
  });
  page.on("requestfailed", (req) => {
    console.log(
      `[requestfailed] ${req.method()} ${req.url()} ${req.failure()?.errorText}`,
    );
  });
  page.on("response", async (res) => {
    if (res.url().includes("/health")) {
      console.log(`[response] ${res.status()} ${res.url()}`);
    }
  });
});

test("widok /health pokazuje komunikat z API", async ({ page }, testInfo) => {
  console.log(`[test] WEB_BASE_URL=${process.env.WEB_BASE_URL ?? ""}`);
  await page.goto("/health");
  try {
    await expect(page.getByText("Witamy z API")).toBeVisible({
      timeout: 20000,
    });
  } catch (e) {
    const html = await page.content();
    await testInfo.attach("dom.html", {
      body: Buffer.from(html),
      contentType: "text/html",
    });
    await testInfo.attach("screenshot.png", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
    throw e;
  }
});

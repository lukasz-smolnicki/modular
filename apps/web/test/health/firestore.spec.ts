import { test, expect } from "@playwright/test";

test("widok /health pokazuje komunikat z FIRESTORE", async ({
  page,
}, testInfo) => {
  await page.goto("/health");
  try {
    await expect(page.getByText("Witamy z FIRESTORE")).toBeVisible({
      timeout: 20000,
    });
  } catch (e) {
    await testInfo.attach("dom.html", {
      body: Buffer.from(await page.content()),
      contentType: "text/html",
    });
    await testInfo.attach("screenshot.png", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
    throw e;
  }
});

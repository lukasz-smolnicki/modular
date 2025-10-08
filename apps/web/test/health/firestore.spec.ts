import { test, expect } from "@playwright/test";

test("widok /health pokazuje komunikat z FIRESTORE", async ({ page }) => {
  await page.goto("/health");
  await expect(page.getByText("Witamy z FIRESTORE")).toBeVisible({
    timeout: 20000,
  });
});

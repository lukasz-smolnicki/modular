import { test, expect } from "@playwright/test";

test("widok /health pokazuje komunikat z API", async ({ page }) => {
  await page.goto("/health");
  await expect(page.getByText("Witamy z API")).toBeVisible({
    timeout: 20000,
  });
});

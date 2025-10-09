import { test, expect } from "@playwright/test";

test("lista modułów zawiera Użytkownicy", async ({ page }) => {
  await page.goto("/modules");
  await expect(page.getByText("Użytkownicy")).toBeVisible({ timeout: 20000 });
});

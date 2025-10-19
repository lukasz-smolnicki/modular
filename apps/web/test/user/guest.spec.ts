import { test, expect } from "@playwright/test";

test("/user pokazuje Logowanie dla niezalogowanego", async ({ page }) => {
  await page.goto("/user");
  await expect(page.getByText("Logowanie")).toBeVisible();
});

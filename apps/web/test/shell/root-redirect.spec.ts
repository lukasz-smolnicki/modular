import { test, expect } from "@playwright/test";

test("root '/' przekierowuje do /user i widać top-bar + sidebar", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/user$/);
  await expect(page.getByText("PowerApp")).toBeVisible();
  await expect(page.getByText("Moduły")).toBeVisible();
});

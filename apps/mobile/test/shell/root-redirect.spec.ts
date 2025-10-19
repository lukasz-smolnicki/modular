import { test, expect } from "@playwright/test";

test("root '/' prowadzi do /user i widać belkę z dropdownem", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/user$/);
  await expect(page.getByText("PowerApp")).toBeVisible();
  await expect(page.getByText(/Moduły/i)).toBeVisible();
});

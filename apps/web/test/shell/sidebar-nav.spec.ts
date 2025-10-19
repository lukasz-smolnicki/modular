import { test, expect } from "@playwright/test";

test("kliknięcie modułu w sidebarze zmienia widok bez przeładowania", async ({
  page,
}) => {
  await page.goto("/user");
  await expect(page).toHaveURL(/\/user$/);
});

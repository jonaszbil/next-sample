import { test, expect } from "@playwright/test";

test.describe("Example tests", () => {
  test("has title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Sample app/);
  });

  test("home page contains 3 cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("card")).toHaveCount(3);
  });

  test("card text changes when clicked", async ({ page }) => {
    await page.goto("/");
    const btn = page.getByTestId("card").first().locator("button");
    await expect(btn).toHaveText("Click me");
    await btn.click();
    await expect(btn).toHaveText("Clicked");
  });
});

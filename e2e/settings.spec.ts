import test, { expect } from "@playwright/test";

// test('update the log level', async ({ page }) => {
//     await page.goto('/dashboard');
//     await page.getByRole('link', { name: 'Settings' }).click();
//     await page.getByLabel('Log level').selectOption('TRACE');
//     await page.getByRole('main').locator('div').filter({ hasText: 'Log' }).getByRole('button').click();
//     await expect(page.locator('span').filter({ hasText: 'success ! The log level has' }).locator('b')).toBeVisible();
// })

test("update the URL with wrong URL applies", async ({ page }) => {
  await page.goto("/dashboard");
  await page.locator("a").filter({ hasText: "Settings" }).click();
  await page.getByLabel("Address").click();
  await page.getByLabel("Address").fill("hello");
  await expect(page.getByLabel("Address")).toHaveAttribute("aria-invalid");
  await expect(page.locator(".refresh svg")).toHaveAttribute(
    "color",
    "#494949"
  );
  await page.getByLabel("Address").fill("http://127.0.0.1:8079");
  await expect(page.getByLabel("Address")).not.toHaveAttribute("aria-invalid");
  await expect(page.locator(".refresh svg")).not.toHaveAttribute(
    "aria-disabled"
  );
  await expect(page.getByLabel("Address")).toHaveValue("http://127.0.0.1:8079");
  await page.locator(".refresh").click();
  await expect(
    page.locator(".health-checks ul li").nth(2).getByTestId("icon-error")
  ).toBeVisible();
  await expect(
    page.locator(".health-checks ul li").nth(2).getByTestId("icon-success")
  ).not.toBeVisible();
  await page.getByLabel("Address").fill("http://127.0.0.1:8080");
  await page.locator(".refresh").click();
  await expect(
    page.locator(".health-checks ul li").nth(2).getByTestId("icon-error")
  ).not.toBeVisible();
  await expect(
    page.locator(".health-checks ul li").nth(2).getByTestId("icon-success")
  ).toBeVisible();
});

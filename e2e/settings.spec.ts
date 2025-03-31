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
  await page.getByLabel("Address").blur();
  await expect(page.getByLabel("Address")).toHaveAttribute("aria-invalid");
  await expect(page.locator(".refresh svg")).toHaveAttribute(
    "color",
    "#494949"
  );
  await page.getByLabel("Address").fill("http://127.0.0.1:8079");
  await page.getByLabel("Address").blur();
  await expect(page.getByLabel("Address")).not.toHaveAttribute("aria-invalid");
  await expect(page.locator(".refresh svg")).not.toHaveAttribute(
    "aria-disabled"
  );
  await expect(page.getByLabel("Address")).toHaveValue("http://127.0.0.1");
  await expect(page.getByLabel("Port")).toHaveValue("8079");
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

test("update the URL with basic auth save the credentials", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await page.locator("a").filter({ hasText: "Settings" }).click();
  await page.getByLabel("Address").click();
  await page.getByLabel("Address").fill("http://localhost:8080");
  await page.getByLabel("Address").blur();
  await expect(page.getByLabel("Address")).not.toHaveAttribute("aria-invalid");
  await expect(page.locator(".refresh svg")).not.toHaveAttribute(
    "aria-disabled"
  );
  await page.getByLabel("Enable basic authentication").check();
  await page.getByLabel("Username").fill("hello");
  await page.getByLabel("Password").fill("world");

  let failedRequestAuthorization;
  page.on("requestfailed", async (request) => {
    failedRequestAuthorization = await request.headerValue("Authorization");
  });

  await page.locator(".refresh").click();

  await page.waitForTimeout(1000);

  expect(failedRequestAuthorization).toBe("Basic " + btoa("hello:world"));

  await page.reload();

  await expect(page.getByLabel("Username")).toHaveValue("hello");
  await expect(page.getByLabel("Password")).toHaveValue("world");
  await expect(page.getByLabel("Enable basic authentication")).toBeChecked();

  await page.getByLabel("Enable basic authentication").uncheck();
  await expect(
    page.getByLabel("Enable basic authentication")
  ).not.toBeChecked();

  let successRequestAuthorization: string | null = "failed";
  page.on("request", async (request) => {
    if (request.url().endsWith("/api/codex/v1/spr")) {
      successRequestAuthorization = await request.headerValue("Authorization");
    }
  });

  await page.locator(".refresh").click();

  await page.waitForRequest("http://localhost:8080/api/codex/v1/spr");

  expect(successRequestAuthorization).toBeNull();

  await page.reload();

  await expect(
    page.getByLabel("Enable basic authentication")
  ).not.toHaveAttribute("checked");
});

import { test, expect } from "@playwright/test";

test.describe("onboarding", () => {
  test("onboarding steps", async ({ page, browserName }) => {
    await page.context().setOffline(false);
    await page.goto("/");
    await expect(
      page.getByText(
        "Codex is a durable, decentralised data storage protocol, created so the world community can preserve its most important knowledge without risk of censorship."
      )
    ).toBeVisible();
    await page.locator(".navigation").click();
    await expect(page.locator(".navigation")).toHaveAttribute("aria-disabled");
    await page.getByLabel("Preferred name").fill("Arnaud");
    await expect(page.locator(".navigation")).not.toHaveAttribute(
      "aria-disabled"
    );
    await page.locator(".navigation").click();

    // Network
    await expect(
      page.locator(".health-checks ul li").nth(1).getByTestId("icon-error")
    ).not.toBeVisible();
    await expect(
      page.locator(".health-checks ul li").nth(1).getByTestId("icon-success")
    ).toBeVisible();

    // Port forwarding
    await expect(
      page.locator(".health-checks ul li").nth(2).getByTestId("icon-error")
    ).not.toBeVisible();
    await expect(
      page.locator(".health-checks ul li").nth(2).getByTestId("icon-success")
    ).toBeVisible();

    // Codex node
    await expect(
      page.locator(".health-checks ul li").nth(2).getByTestId("icon-error")
    ).not.toBeVisible();
    await expect(
      page.locator(".health-checks ul li").nth(2).getByTestId("icon-success")
    ).toBeVisible();

    // Marketplace
    //await expect(page.locator(".health-checks ul li").nth(3).getByTestId("icon-warning")).toBeVisible({ timeout: 10_000 })
    await expect(page.locator(".health-checks ul li").nth(3)).toBeVisible();

    // Can be simulated with File -> Work offline
    if (browserName.toLowerCase() !== "firefox") {
      await page.context().setOffline(true);

      // Network
      await expect(
        page.locator(".health-checks ul li").nth(1).getByTestId("icon-error")
      ).toBeVisible();
      await expect(
        page.locator(".health-checks ul li").nth(1).getByTestId("icon-success")
      ).not.toBeVisible();

      await page.context().setOffline(false);
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.context().setOffline(false);
  });
});

test("does not display undefined when delete the url value", async ({
  page,
}) => {
  await page.goto("/onboarding-checks");
  await page.locator("#url").focus();

  for (let i = 0; i < "http://localhost:8080".length; i++) {
    await page.keyboard.press("Backspace");
  }

  await expect(page.locator("#url")).toHaveValue("");
  await page.locator("#url").blur();
  await expect(page.locator("#url")).toHaveAttribute("aria-invalid");
  await expect(page.locator(".refresh svg")).toHaveAttribute(
    "color",
    "#494949"
  );
});

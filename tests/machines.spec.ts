import { test, expect } from "@playwright/test";

let machineListRequests: (string | Buffer)[] = [];
let machineCountRequests: (string | Buffer)[] = [];

test.beforeEach(async ({ page, context }) => {
  machineListRequests = [];
  machineCountRequests = [];
  await context.addCookies([
    { name: "skipsetupintro", value: "true", url: "http://0.0.0.0:5240/" },
    { name: "skipintro", value: "true", url: "http://0.0.0.0:5240/" },
  ]);
  await page.goto("/MAAS/r/machines");
  await page.getByLabel("Username").click();
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Username").press("Tab");
  await page.getByLabel("Password").fill("test");
  await page.getByLabel("Password").press("Enter");
});

test("machines list loads", async ({ page }) => {
  page.on("websocket", async (ws) => {
    console.log(`WebSocket opened: ${ws.url()}>`);
    await ws.on("framesent", async (data) => {
      console.log(data.payload);
      if (data.payload.includes("machine.list")) {
        machineListRequests.push(data.payload);
      }
      if (data.payload.includes("machine.count")) {
        machineCountRequests.push(data.payload);
      }
    });
    ws.on("close", () => console.log("WebSocket closed"));
  });
  await expect(page).toHaveTitle(/Machines/);
  await expect(page.getByTestId("section-header-title")).toHaveText(
    /[0-9]+ machine[s]? in [0-9]+ pool[s]?/i
  );
  await expect(page.getByRole("grid", { name: /Loading/i })).not.toBeVisible();
  // expect a single machine.list and machine.count request
  await expect(machineListRequests.length).toBe(1);
  await expect(machineCountRequests.length).toBe(1);
  // perform machine search
  await page.getByLabel("Search").type("doesnotexist");
  await expect(page.getByRole("grid", { name: /Loading/i })).not.toBeVisible();
  await expect(
    page.getByRole("status", {
      name: /No machines match the search criteria/i,
    })
  ).toBeVisible();
  // expect an additional single machine.list request
  await expect(machineListRequests.length).toBe(2);
  await expect(machineCountRequests.length).toBe(1);
});

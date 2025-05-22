import "@testing-library/cypress/add-commands";
import type { Result } from "axe-core";
import { LONG_TIMEOUT } from "../constants";
import {
  generateId,
  generateMAASURL,
  generateMac,
  generateName,
  generateVid,
} from "../e2e/utils";
import type { A11yPageContext } from "./e2e";

Cypress.Commands.add("login", (options) => {
  const defaultOptions = {
    username: Cypress.env("username"),
    password: Cypress.env("password"),
    shouldSkipIntro: true,
    shouldSkipSetupIntro: true,
  };
  const { username, password, shouldSkipIntro, shouldSkipSetupIntro } = {
    ...defaultOptions,
    ...options,
  };

  shouldSkipSetupIntro && cy.setCookie("skipsetupintro", "true");
  shouldSkipIntro && cy.setCookie("skipintro", "true");

  cy.request({
    method: "POST",
    url: `${Cypress.env("BASENAME")}/accounts/login/`,
    form: true,
    body: {
      username,
      password,
    },
  });
});

Cypress.Commands.add("loginNonAdmin", () => {
  cy.login({
    username: Cypress.env("nonAdminUsername"),
    password: Cypress.env("nonAdminPassword"),
  });
});

Cypress.Commands.add("addMachine", (hostname = generateName()) => {
  cy.visit(generateMAASURL("/machines"));
  cy.findByRole("button", { name: "Add hardware" }).click();
  cy.get(".p-contextual-menu__link").contains("Machine").click();
  cy.get("input[name='hostname']").type(hostname);
  cy.get("input[name='pxe_mac']").type(generateMac());
  cy.get("select[name='power_type']").select("manual");
  cy.get("select[name='power_type']").blur();
  cy.findByRole("button", { name: /save machine/i }).click();
  cy.get(`[data-testid='message']:contains(${hostname} added successfully.)`, {
    timeout: LONG_TIMEOUT,
  });
});

Cypress.Commands.add("deleteMachine", (hostname: string) => {
  cy.visit(generateMAASURL("/machines"));
  cy.findByRole("combobox", { name: "Group by" }).select("No grouping");
  cy.findByRole("searchbox").type(hostname);
  cy.findByText(/Showing 1 out of 1 machines/, {
    timeout: LONG_TIMEOUT,
  }).should("exist");
  cy.findByRole("grid", { name: /Machines/ }).within(() =>
    cy
      .findByRole("checkbox", { name: new RegExp(hostname) })
      .click({ force: true })
  );
  cy.findByRole("button", { name: /Delete/i }).click();
  cy.findByRole("button", { name: /Delete machine/ }).click();
  cy.findByRole("complementary", { name: /Delete/i }).should("not.exist");
  cy.findByText(/No machines match the search criteria/).should("exist");
});

Cypress.Commands.add("deletePool", (pool: string) => {
  cy.visit(generateMAASURL("/pools"));
  cy.findByRole("row", { name: new RegExp(`${pool}`) }).within(() => {
    cy.findByRole("button", { name: /Delete/i }).click();
  });
  cy.findByRole("complementary", { name: /Delete/i })
    .should("be.visible")
    .within(() => {
      cy.findByRole("button", { name: /Delete/i }).click();
    });
  cy.findByRole("row", { name: new RegExp(`${pool}`) }).should("not.exist");
});

Cypress.Commands.add("addMachines", (hostnames: string[]) => {
  cy.visit(generateMAASURL("/machines"));
  cy.findByRole("button", { name: "Add hardware" }).click();
  cy.get(".p-contextual-menu__link").contains("Machine").click();
  hostnames.forEach((hostname, index) => {
    cy.get("input[name='hostname']").type(hostname);
    cy.get("input[name='pxe_mac']").type(generateMac());
    cy.get("select[name='power_type']").select("manual");
    cy.get("select[name='power_type']").blur();
    if (index < hostnames.length - 1) {
      cy.findByRole("button", { name: /Save and add another/i }).click();
    } else {
      cy.findByRole("button", { name: /Save machine/i }).click();
    }
    cy.get(`[data-testid='message']:contains(${hostname} added successfully.)`);
  });
});

Cypress.Commands.add(
  "addSubnet",
  ({
    subnetName = `cy-subnet-${generateId()}`,
    cidr = "192.168.122.18",
    fabric = `cy-fabric-${generateId()}`,
    vid = generateVid(),
    vlan = `cy-vlan-${vid}`,
  }) => {
    cy.visit(generateMAASURL("/networks?by=fabric"));
    cy.findByRole("button", { name: "Add" }).click();
    cy.findByRole("button", { name: "Subnet" }).click();
    cy.findByRole("textbox", { name: "CIDR" }).type(cidr);
    cy.findByRole("textbox", { name: "Name" }).type(subnetName);
    cy.findByRole("combobox", { name: "Fabric" }).select(fabric);
    cy.findByRole("combobox", { name: "VLAN" }).select(`${vid} (${vlan})`);
    cy.findByRole("button", { name: "Add Subnet" }).click();
  }
);

function logViolations(violations: Result[], pageContext: A11yPageContext) {
  const divider =
    "\n====================================================================================================\n";
  const separator =
    "\n────────────────────────────────────────────────────────────────────────────────────────────────────\n";

  cy.task("log", divider);
  cy.task(
    "log",
    `"${pageContext.title}" page (${pageContext.url})\n\n✖ ${
      violations.length
    } accessibility violation${violations.length === 1 ? "" : "s"}:`
  );
  cy.task("log", separator);

  violations.forEach((violation, index) => {
    const html = violation.nodes.map((node) => node.html);
    const impact = `[${violation.impact?.toUpperCase()}]`;
    const count = `${index + 1}.`;
    const id = `[${violation.id}]`;

    cy.task("log", `${count} ${impact} ${id} ${violation.help}:`);
    cy.task("log", `   (${violation.helpUrl})\n`);
    cy.task("log", `${html.map((htmlCode) => `- ${htmlCode}\n`).join("")}`);
  });
}

Cypress.Commands.add("testA11y", (pageContext) => {
  cy.injectAxe();
  cy.checkA11y(
    undefined,
    {
      runOnly: {
        type: "tag",
        values: ["wcag21aa"],
      },
    },
    (violations) => logViolations(violations, pageContext),
    Cypress.env("skipA11yFailures")
  );
});

Cypress.Commands.add("waitForPageToLoad", () => {
  cy.findByText(/Loading/, { timeout: LONG_TIMEOUT }).should("not.exist");
  cy.findByText("Failed to connect").should("not.exist");
  cy.findByRole("heading", { level: 1 }).should("be.visible");
});

Cypress.Commands.add("waitForTableToLoad", ({ name } = { name: undefined }) => {
  cy.findByRole("grid", { name: /Loading/i }).should("exist");
  cy.findByRole("grid", { name: /Loading/i, timeout: LONG_TIMEOUT }).should(
    "not.exist"
  );
  return cy.findByRole("grid", { name }).should("exist");
});

Cypress.Commands.add("getMainNavigation", () => {
  return cy.findByRole("banner", { name: /main navigation/i });
});

Cypress.Commands.add("expandMainNavigation", () => {
  return cy
    .window()
    .then((win) => win.localStorage.setItem("appSideNavIsCollapsed", "false"));
});

import "@testing-library/cypress/add-commands";
import type { Result } from "axe-core";
import { customAlphabet } from "nanoid";
import { generateMAASURL, generateMac } from "../e2e/utils";
import type { A11yPageContext } from "./e2e";

const nanoid = customAlphabet("1234567890abcdefghi", 10);

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

Cypress.Commands.add("addMachine", (hostname = `cypress-${nanoid()}`) => {
  cy.visit(generateMAASURL("/machines"));
  cy.get("[data-testid='add-hardware-dropdown'] button").click();
  cy.get(".p-contextual-menu__link").contains("Machine").click();
  cy.get("input[name='hostname']").type(hostname);
  cy.get("input[name='pxe_mac']").type(generateMac());
  cy.get("select[name='power_type']").select("manual").blur();
  cy.get("button[type='submit']").click();
  cy.get(`[data-testid='message']:contains(${hostname} added successfully.)`);
});

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
  cy.get("[data-testid='section-header-title-spinner]").should("not.exist");
  cy.get("[data-testid='section-header-subtitle-spinner']").should("not.exist");
  cy.findByText("Failed to connect").should("not.exist");
  cy.get("[data-testid='section-header-title']").should("be.visible");
});

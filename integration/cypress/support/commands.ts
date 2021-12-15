import { BASENAME } from "@maas-ui/maas-ui-shared";
import type { A11yPageContext } from "./index";

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
    url: `${BASENAME}/accounts/login/`,
    form: true,
    body: {
      username,
      password,
    },
  });
});

type Violation = {
  id: string;
  impact: string;
  tags: string[];
  help: string;
  helpUrl: string;
  description: string;
  nodes: Array<{
    any: any;
    all: any;
    none: any;
    impact: any;
    html: Array<string>;
    target: any;
    failureSummary: any;
  }>;
};

function logViolations(violations: Violation[], pageContext: A11yPageContext) {
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
    undefined,
    (violations) => logViolations(violations, pageContext),
    Cypress.env("skipA11yFailures")
  );
});

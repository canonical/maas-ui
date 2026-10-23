/// <reference types="cypress" />

import "@percy/cypress";
import "cypress-axe";
import "cypress-wait-until";
import "./commands";

import { APP_WARM_UP_TIMEOUT } from "../constants";
import { generateMAASURL } from "../e2e/utils";

export type A11yPageContext = { url?: string; title?: string };
export type SubnetOptions = {
  subnetName?: string;
  cidr?: string;
  fabric?: string;
  vid?: string;
  vlan?: string;
};
declare global {
  namespace Cypress {
    interface Chainable {
      addMachine(hostname?: string): void;
      addMachines(hostname: string[]): void;
      deleteMachine(hostname: string): void;
      deletePool(pool: string): void;
      login(options?: {
        username?: string;
        password?: string;
        shouldSkipIntro?: boolean;
        shouldSkipSetupIntro?: boolean;
      }): void;
      loginNonAdmin(): void;
      testA11y(pageContext: A11yPageContext): void;
      waitForPageToLoad(): void;
      waitForTableToLoad(options?: {
        name?: string | RegExp;
        role?: string;
      }): Cypress.Chainable<JQuery<HTMLElement>>;
      getMainNavigation(): Cypress.Chainable<JQuery<HTMLElement>>;
      expandMainNavigation(): void;
      addSubnet(options: SubnetOptions): void;
    }
  }
}

Cypress.on("uncaught:exception", (err) => {
  /*
   Prevent cypress tests from failing when visiting maas.io
   due to scripts not being loaded early enough:
   Error examples: 'canonicalGlobalNav is not defined'
   */
  const unloadedScripts = ["canonicalGlobalNav", "hljs", "drpNs", "cpNs"];
  if (unloadedScripts.some((script) => err.message.includes(script))) {
    return false;
  }
});

// The dev server compiles the app on its first page load, which can exceed
// the page load timeout on CI. Load the app once per run, before whichever
// spec happens to run first, so tests start against a warm server.
before(() => {
  cy.task<boolean>("isAppWarmedUp").then((isAppWarmedUp) => {
    if (isAppWarmedUp) {
      return;
    }
    cy.visit(generateMAASURL("/"), { timeout: APP_WARM_UP_TIMEOUT });
    cy.get("#maas-ui", { timeout: APP_WARM_UP_TIMEOUT }).should("exist");
    cy.task("markAppWarmedUp");
  });
});

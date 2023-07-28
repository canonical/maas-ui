/// <reference types="cypress" />

import "cypress-axe";
import "cypress-wait-until";
import "@percy/cypress";
import "./commands";

export type A11yPageContext = { url?: string; title?: string };
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
      }): Cypress.Chainable<JQuery<HTMLElement>>;
      getMainNavigation(): Cypress.Chainable<JQuery<HTMLElement>>;
      expandMainNavigation(): void;
    }
  }
}

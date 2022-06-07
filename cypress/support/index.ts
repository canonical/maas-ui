/// <reference types="cypress" />

import "cypress-axe";
import "cypress-wait-until";
import "@percy/cypress";
import "./commands";

export type A11yPageContext = { url?: string; title?: string };
declare global {
  namespace Cypress {
    interface Chainable {
      login(options?: {
        username?: string;
        password?: string;
        shouldSkipIntro?: boolean;
        shouldSkipSetupIntro?: boolean;
      }): void;
      generateMAASURL(route?: string): string;
      loginNonAdmin(): void;
      testA11y(pageContext: A11yPageContext): void;
      waitForPageToLoad(): void;
    }
  }
}

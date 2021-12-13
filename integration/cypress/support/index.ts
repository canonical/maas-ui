/// <reference types="cypress" />

import "cypress-axe";
import "cypress-wait-until";
import "./commands";

declare global {
  namespace Cypress {
    interface Chainable {
      login(username?: string, password?: string): void;
      testA11y(): void;
    }
  }
}

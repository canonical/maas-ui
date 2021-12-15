/// <reference types="cypress" />

import "cypress-axe";
import "./commands";

declare global {
  namespace Cypress {
    interface Chainable {
      login(username?: string, password?: string): void;
    }
  }
}

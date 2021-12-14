/// <reference types="cypress" />

import type { Options } from "cypress-axe";
import "cypress-axe";
import type { ContextObject } from "axe-core";
import "cypress-wait-until";
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
      testA11y(pageContext: A11yPageContext): void;
    }
  }
}

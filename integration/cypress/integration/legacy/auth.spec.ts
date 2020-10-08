import { generateLegacyURL, generateNewURL } from "@maas-ui/maas-ui-shared";

import { login } from "../utils";

context("Legacy authentication", () => {
  it("redirects to the login page when not authenticated", () => {
    cy.visit(generateLegacyURL("/images"));
    cy.location("pathname").should("eq", generateNewURL());
  });

  it("displays pages when logged in", () => {
    login();
    cy.visit(generateLegacyURL("/images"));
    cy.location("pathname").should("eq", generateLegacyURL("/images"));
  });
});

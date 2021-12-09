import { generateLegacyURL, generateNewURL } from "@maas-ui/maas-ui-shared";

context("Legacy authentication", () => {
  it("redirects to the login page when not authenticated", () => {
    cy.visit(generateLegacyURL("/images"));
    cy.location("pathname").should("eq", generateNewURL());
  });

  it("displays pages when logged in", () => {
    cy.login();
    cy.visit(generateLegacyURL("/images"));
    cy.location("pathname").should("eq", generateLegacyURL("/images"));
  });
});

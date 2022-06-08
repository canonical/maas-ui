import { generateMAASURL } from "../../utils";

context("Legacy authentication", () => {
  it("redirects to the login page when not authenticated", () => {
    cy.visit(generateMAASURL("/images"));
    cy.location("pathname").should("eq", generateMAASURL());
  });

  it("displays pages when logged in", () => {
    cy.login();
    cy.visit(generateMAASURL("/images"));
    cy.location("pathname").should("eq", generateMAASURL("/images"));
  });
});

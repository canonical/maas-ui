import { generateMAASURL } from "../../utils";

context("Intro", () => {
  beforeEach(() => {
    cy.login({ shouldSkipSetupIntro: false, shouldSkipIntro: false });
    cy.visit(generateMAASURL("/"));
    cy.waitForPageToLoad();
  });

  it("displays intro page after login", () => {
    cy.findByRole("heading", { name: /Welcome to MAAS/i }).should("exist");
    cy.location("pathname").should("eq", generateMAASURL("/intro"));
  });

  it("redirects to images setup after saving intro setup changes", () => {
    cy.findByRole("heading", { name: /Welcome to MAAS/i }).should("exist");
    cy.waitForPageToLoad();
    cy.findByRole("button", { name: /Save/i }).click();

    cy.location("pathname").should("eq", generateMAASURL("/intro/images"));
  });

  it("allows to skip the initial setup", () => {
    cy.findByRole("heading", { name: /Welcome to MAAS/i }).should("exist");
    cy.findByRole("button", { name: /Skip/i }).click();
    cy.findByText(
      /Are you sure you want to skip the initial MAAS setup?/i
    ).should("exist");
    cy.findByRole("button", { name: /Skip/i }).click();
    cy.location("pathname").should("eq", generateMAASURL("/intro/user"));
  });
});

import { generateMAASURL } from "../../utils";

context("Login page", () => {
  beforeEach(() => {
    cy.visit(generateMAASURL("/"));
    cy.expandMainNavigation();
  });

  it("displays an error message if submitted invalid login credentials", () => {
    cy.findByRole("textbox", { name: /Username/ }).type("user");
    cy.findByRole("button", { name: /Next/ }).click();
    cy.findByLabelText(/Password/).type("invalid-password");
    cy.findByRole("button", { name: /Login/ }).click();
    cy.findByRole("alert")
      .should("be.visible")
      .should("include.text", "Please enter a correct username and password");
  });

  it("logs in and redirects to the intro", () => {
    cy.get("input[name='username']").type(Cypress.env("username"));
    cy.findByRole("button", { name: /Next/ }).click();
    cy.get("input[name='password']").type(Cypress.env("password"));
    cy.get("button[type='submit']").click();
    cy.location("pathname").should("eq", generateMAASURL("/intro"));
  });

  it("logs in and redirects to the user intro if setup intro complete", () => {
    // Log in - should go to setup intro.
    cy.get("input[name='username']").type(Cypress.env("username"));
    cy.findByRole("button", { name: /Next/ }).click();
    cy.get("input[name='password']").type(Cypress.env("password"));
    cy.get("button[type='submit']").click();
    cy.location("pathname").should("eq", generateMAASURL("/intro"));

    // Log out.
    cy.getMainNavigation().within(() =>
      cy.findByRole("button", { name: /Log out/i }).click()
    );
    // Set cookie to skip setup intro.
    cy.setCookie("skipsetupintro", "true");

    // Log in again - should go straight to user intro.
    cy.get("input[name='username']").type(Cypress.env("username"));
    cy.findByRole("button", { name: /Next/ }).click();
    cy.get("input[name='password']").type(Cypress.env("password"));
    cy.get("button[type='submit']").click();
    cy.location("pathname").should("eq", generateMAASURL("/intro/user"));
  });

  it("logs in and redirects to the machine list", () => {
    // Set cookies to skip setup and user intros.
    cy.setCookie("skipsetupintro", "true");
    cy.setCookie("skipintro", "true");
    cy.get("input[name='username']").type(Cypress.env("username"));
    cy.findByRole("button", { name: /Next/ }).click();
    cy.get("input[name='password']").type(Cypress.env("password"));
    cy.get("button[type='submit']").click();
    cy.location("pathname").should("eq", generateMAASURL("/machines"));
  });
});

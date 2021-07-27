import { generateLegacyURL, generateNewURL } from "@maas-ui/maas-ui-shared";

context("Login page", () => {
  beforeEach(() => {
    cy.visit(generateNewURL("/"));
  });

  afterEach(() => {
    cy.clearCookie("skipintro");
    cy.clearCookie("skipsetupintro");
  });

  it("is disabled by default", () => {
    cy.get("button").should("have.attr", "disabled", "disabled");
  });

  it("shows form errors if username is focused and blurred while empty", () => {
    cy.get("input[name='username']").focus();
    cy.get("input[name='username']").blur();
    cy.get(".p-form-validation__message").should("exist");
  });

  it("shows form errors if password is focused and blurred while empty", () => {
    cy.get("input[name='password']").focus();
    cy.get("input[name='password']").blur();
    cy.get(".p-form-validation__message").should("exist");
  });

  it("enables the form if both fields have values", () => {
    cy.get("button").should("have.attr", "disabled", "disabled");
    cy.get("input[name='username']").type("username");
    cy.get("input[name='password']").type("password");
    cy.get("button").should("not.have.attr", "disabled", "disabled");
  });

  it("displays an error notification if wrong credentials provided", () => {
    cy.server();
    cy.get("input[name='username']").type("username");
    cy.get("input[name='password']").type("password{enter}");
    cy.get(".p-notification--negative").should("exist");
  });

  it("logs in and redirects to the intro", () => {
    cy.get("input[name='username']").type(Cypress.env("username"));
    cy.get("input[name='password']").type(Cypress.env("password"));
    cy.get("button[type='submit']").click();
    cy.location("pathname").should("eq", generateNewURL("/intro"));
  });

  it("logs in and redirects to the user intro if setup intro complete", () => {
    // Log in - should go to setup intro
    cy.get("input[name='username']").type(Cypress.env("username"));
    cy.get("input[name='password']").type(Cypress.env("password"));
    cy.get("button[type='submit']").click();
    cy.location("pathname").should("eq", generateNewURL("/intro"));

    // Open the skip confirmation.
    cy.get("button[data-test='secondary-submit']").click();

    // Confirm skipping setup intro - should redirect to user intro.
    cy.get("button[data-test='action-confirm']").click();
    cy.location("pathname").should("eq", generateNewURL("/intro/user"));

    // Log out.
    cy.get(".p-navigation__link a:contains(Log out)").click();

    // Log in again - should go straight to user intro.
    cy.get("input[name='username']").type(Cypress.env("username"));
    cy.get("input[name='password']").type(Cypress.env("password"));
    cy.get("button[type='submit']").click();
    cy.location("pathname").should("eq", generateNewURL("/intro/user"));
  });

  it("logs in and redirects to the machine list", () => {
    cy.setCookie("skipintro", "true");
    cy.get("button").should("have.attr", "disabled", "disabled");
    cy.get("input[name='username']").type(Cypress.env("username"));
    cy.get("input[name='password']").type(Cypress.env("password"));
    cy.get("button[type='submit']").click();
    cy.location("pathname").should("eq", generateNewURL("/machines"));
  });
});

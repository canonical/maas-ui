import { makeUIURL } from "../utils";

context("Login page", () => {
  beforeEach(() => {
    cy.visit(makeUIURL("/"));
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
});

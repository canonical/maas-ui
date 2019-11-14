context("Login page", () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env("BASENAME")}${Cypress.env("REACT_BASENAME")}`);
  });

  it("gets redirected correctly", () => {
    cy.visit("/");
    cy.location("pathname").should(
      "eq",
      `${Cypress.env("BASENAME")}${Cypress.env("REACT_BASENAME")}`
    );
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
});

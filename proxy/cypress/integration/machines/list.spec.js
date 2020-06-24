import { login } from "../utils";

context("Machine listing", () => {
  beforeEach(() => {
    login();
    cy.setCookie("skipintro", "true");
    cy.visit(
      `${Cypress.env("BASENAME")}${Cypress.env("REACT_BASENAME")}/machines`
    );
  });

  afterEach(() => {
    cy.clearCookie("skipintro");
  });

  it("renders a heading", () => {
    cy.get("li.p-heading--four").contains("Machines");
  });
});

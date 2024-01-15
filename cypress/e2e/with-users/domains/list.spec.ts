import { generateMAASURL } from "../../utils";

context("DNS", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/domains"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='main-toolbar-heading']").contains("DNS");
  });
});

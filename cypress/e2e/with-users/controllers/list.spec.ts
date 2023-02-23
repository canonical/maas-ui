import { generateMAASURL } from "../../utils";

context("Controller listing", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/controllers"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("Controllers");
  });
});

import { generateMAASURL } from "../../utils";

context("Settings", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/settings"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("Settings");
  });
});

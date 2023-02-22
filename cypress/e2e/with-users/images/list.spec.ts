import { generateMAASURL } from "../../utils";

context("Images list", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/images"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("Images");
  });
});

import { generateMAASURL } from "../../utils";

context("Settings", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/settings"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("Settings");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__item.is-selected a").should(
      "have.attr",
      "href",
      generateMAASURL("/settings")
    );
  });
});

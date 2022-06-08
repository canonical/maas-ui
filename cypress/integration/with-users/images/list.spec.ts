import { generateMAASURL } from "../../utils";

context("Images list", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/images"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("Images");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__item.is-selected a").should(
      "have.attr",
      "href",
      generateMAASURL("/images")
    );
  });
});

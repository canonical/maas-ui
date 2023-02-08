import { generateMAASURL } from "../../utils";

context("DNS", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/domains"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("DNS");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".l-navigation__item.is-selected a").should(
      "have.attr",
      "href",
      generateMAASURL("/domains")
    );
  });
});

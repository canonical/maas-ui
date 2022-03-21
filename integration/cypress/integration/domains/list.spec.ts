import { generateNewURL } from "@maas-ui/maas-ui-shared";

context("DNS", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateNewURL("/domains"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("DNS");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__item.is-selected a").should(
      "have.attr",
      "href",
      generateNewURL("/domains")
    );
  });
});

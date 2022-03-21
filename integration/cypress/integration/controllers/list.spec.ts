import { generateNewURL } from "@maas-ui/maas-ui-shared";

context("Controller listing", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateNewURL("/controllers"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("Controllers");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__item.is-selected a").should(
      "have.attr",
      "href",
      generateNewURL("/controllers")
    );
  });
});

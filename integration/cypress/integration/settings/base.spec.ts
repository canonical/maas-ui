import { generateNewURL } from "@maas-ui/maas-ui-shared";

context("Settings", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateNewURL("/settings"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("Settings");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__item.is-selected a").should(
      "have.attr",
      "href",
      generateNewURL("/settings")
    );
  });
});

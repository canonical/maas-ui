import { generateNewURL } from "@maas-ui/maas-ui-shared";

context("Images list", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateNewURL("/images"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("Images");
    cy.testA11y();
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__link.is-selected a").should(
      "have.attr",
      "href",
      generateNewURL("/images")
    );
  });
});

import { generateNewURL } from "@maas-ui/maas-ui-shared";

context("Device listing", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateNewURL("/devices"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("Devices");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__item.is-selected a").should(
      "have.attr",
      "href",
      generateNewURL("/devices")
    );
  });
});

import { generateLegacyURL } from "@maas-ui/maas-ui-shared";

context("Subnets", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateLegacyURL("/networks?by=fabric"));
  });

  it("renders the correct heading", () => {
    cy.get(".page-header__title").contains("Subnets");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__link.is-selected a").should(
      "have.attr",
      "href",
      generateLegacyURL("/networks?by=fabric")
    );
  });
});

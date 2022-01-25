import { generateLegacyURL } from "@maas-ui/maas-ui-shared";

context("Subnets", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateLegacyURL("/networks?by=fabric"));
    cy.viewport("macbook-11");
  });

  it("renders the correct heading", () => {
    cy.findByRole("heading", { level: 1 }).contains("Subnets");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__link.is-selected a").should(
      "have.attr",
      "href",
      generateLegacyURL("/networks?by=fabric")
    );
    cy.findByRole("navigation", { name: "primary" }).within(() => {
      cy.findByRole("link", { current: "page" }).should(
        "have.attr",
        "href",
        generateLegacyURL("/networks?by=fabric")
      );
    });
  });
});

import { generateNewURL } from "@maas-ui/maas-ui-shared";

context("KVM listing", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateNewURL("/kvm"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("KVM");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__link.is-selected a").should(
      "have.attr",
      "href",
      generateNewURL("/kvm")
    );
  });
});

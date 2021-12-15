import { generateNewURL } from "@maas-ui/maas-ui-shared";

context("User preferences", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateNewURL("/account/prefs"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("My preferences");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__link.is-selected a").should(
      "have.attr",
      "href",
      generateNewURL("/account/prefs")
    );
  });
});

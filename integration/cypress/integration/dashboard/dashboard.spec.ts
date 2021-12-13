import { generateNewURL } from "@maas-ui/maas-ui-shared";

context("Dashboard", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateNewURL("/dashboard"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains(
      "Network discovery"
    );
    cy.testA11y();
  });

  it("displays the discoveries tab by default", () => {
    const tab = ".p-tabs__link[aria-selected='true']";
    cy.get(tab).should("exist");
    cy.get(tab).contains("discover");
  });

  it("can display the configuration tab", () => {
    cy.get(".p-tabs__link:contains(Configuration)").click();
    const tab = ".p-tabs__link[aria-selected='true']";
    cy.get(tab).should("exist");
    cy.get(tab).contains("Configuration");
  });
});

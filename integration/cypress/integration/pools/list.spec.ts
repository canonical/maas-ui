import { generateNewURL } from "@maas-ui/maas-ui-shared";

context("Pools list", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateNewURL("/pools"));
  });

  it("renders a heading", () => {
    cy.contains("1 Resource pool");
    cy.testA11y();
  });
});

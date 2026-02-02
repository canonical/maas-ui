import { generateMAASURL } from "../../utils";

context("Network Discovery", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/network-discovery"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='main-toolbar-heading']").contains(
      "Network discovery"
    );
  });
});

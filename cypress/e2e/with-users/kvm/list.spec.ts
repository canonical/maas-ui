import { generateMAASURL } from "../../utils";

context("KVM listing", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/kvm"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='main-toolbar-heading']").contains("LXD");
  });
});

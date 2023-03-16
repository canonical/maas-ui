import { generateMAASURL } from "../../utils";

context("KVM listing", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/kvm"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("LXD");
  });
});

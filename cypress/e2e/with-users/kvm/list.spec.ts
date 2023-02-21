import { generateMAASURL } from "../../utils";

context("KVM listing", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/kvm"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("KVM");
  });

  it("highlights the correct navigation link", () => {
    cy.findByRole("link", { current: "page" }).should(
      "have.attr",
      "href",
      generateMAASURL("/kvm/lxd")
    );
  });
});

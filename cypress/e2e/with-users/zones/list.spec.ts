import { generateMAASURL } from "../../utils";

context("Zones", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/zones"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains(
      "Availability zones"
    );
  });

  it("highlights the correct navigation link", () => {
    cy.findByRole("link", { current: "page" }).should(
      "have.attr",
      "href",
      generateMAASURL("/zones")
    );
  });
});

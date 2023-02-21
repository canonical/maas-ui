import { generateMAASURL } from "../../utils";

context("DNS", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/domains"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("DNS");
  });

  it("highlights the correct navigation link", () => {
    cy.findByRole("link", { current: "page" }).should(
      "have.attr",
      "href",
      generateMAASURL("/domains")
    );
  });
});

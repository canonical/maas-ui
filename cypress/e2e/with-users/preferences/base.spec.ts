import { generateMAASURL } from "../../utils";

context("User preferences", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/account/prefs"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("My preferences");
  });

  it("highlights the correct navigation link", () => {
    cy.findByRole("link", { current: "page" }).should(
      "have.attr",
      "href",
      generateMAASURL("/account/prefs")
    );
  });
});

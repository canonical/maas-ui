import { generateMAASURL } from "../../utils";

context("User preferences", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/account/prefs"));
  });

  it("renders the correct heading", () => {
    cy.get("[data-testid='section-header-title']").contains("My preferences");
  });
});

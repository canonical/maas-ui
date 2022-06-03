import { generateNewURL } from "@maas-ui/maas-ui-shared";

context("Login without users", () => {
  it("shows a create admin message", () => {
    cy.visit(generateNewURL("/"));
    cy.get(".p-card__title").contains("No admin user has been created yet");
  });
});

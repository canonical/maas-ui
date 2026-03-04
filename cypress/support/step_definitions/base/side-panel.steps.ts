import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

Given("the user expands main navigation", () => {
  cy.expandMainNavigation();
});

Given("the side panel is visible", () => {
  cy.get("#aside-panel").should("be.visible");
});

Given("the {string} panel is visible", (panelName: string) => {
  cy.findByRole("complementary", { name: panelName }).should("be.visible");
});

When("the user presses the ESC key", () => {
  cy.get("body").type("{esc}");
});

Then("the {string} panel should not exist", (panelName: string) => {
  cy.findByRole("complementary", { name: panelName }).should("not.exist");
});

Then("the side panel should not be visible", () => {
  cy.get("#aside-panel").should("not.be.visible");
});

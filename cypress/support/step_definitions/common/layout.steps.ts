import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("the main toolbar heading should be {string}", (expectedHeading) => {
  cy.get("[data-testid='main-toolbar-heading']").should(
    "contain",
    expectedHeading
  );
});

Then("the heading should be {string}", (expectedHeading: string) => {
  cy.findByRole("heading", { level: 1 }).contains(expectedHeading);
});

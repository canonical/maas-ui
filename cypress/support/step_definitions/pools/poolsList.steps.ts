import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("the pools heading should show machine and pool counts", () => {
  cy.findByRole("heading", {
    name: /[0-9]+ machine[s]? in [0-9]+ pool[s]?/i,
  }).should("exist");
});

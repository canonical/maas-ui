import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { generateMAASURL } from "../../../e2e/utils";

When("the user navigates to the pools page", () => {
  cy.visit(generateMAASURL("/pools"));
});

Then("the pools heading should show machine and pool counts", () => {
  cy.findByRole("heading", {
    name: /[0-9]+ machine[s]? in [0-9]+ pool[s]?/i,
  }).should("exist");
});

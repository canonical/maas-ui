import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { generateMAASURL } from "../../../e2e/utils";

When("the user navigates to the preferences page", () => {
  cy.visit(generateMAASURL("/account/prefs"));
});

Then("the side navigation title should be {string}", (expectedHeading) => {
  cy.get(".p-side-navigation__title").should("contain", expectedHeading);
});

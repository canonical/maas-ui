import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("the side navigation title should be {string}", (expectedHeading) => {
  cy.get(".p-side-navigation__title").should("contain", expectedHeading);
});

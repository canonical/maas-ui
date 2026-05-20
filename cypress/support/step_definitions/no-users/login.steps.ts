import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("the card title should contain {string}", (text: string) => {
  cy.get(".p-card__title").contains(text);
});

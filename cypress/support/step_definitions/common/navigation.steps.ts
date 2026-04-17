import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";
import { routes } from "../../../constants";
import { generateMAASURL } from "../../../e2e/utils";

Given(/^the user navigates to the (.+) page$/, (page: string) => {
  const path = routes[page];
  cy.visit(generateMAASURL(path));
  cy.waitForPageToLoad();
});

Then(/^the user is redirected to the (.+) page$/, (page: string) => {
  const path = routes[page];
  cy.visit(generateMAASURL(path));
});

Then("the pathname should equal {string}", (expectedPath: string) => {
  cy.location("pathname").should("eq", generateMAASURL(expectedPath));
});

Then("the {string} navigation item should be selected", (itemName: string) => {
  cy.get(".p-side-navigation__item.is-selected a").contains(itemName);
});

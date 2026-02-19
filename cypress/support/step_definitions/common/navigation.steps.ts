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

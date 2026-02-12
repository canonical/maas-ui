import { When } from "@badeball/cypress-cucumber-preprocessor";
import { generateMAASURL } from "../../../e2e/utils";

When("the user navigates to the zones page", () => {
  cy.visit(generateMAASURL("/zones"));
});

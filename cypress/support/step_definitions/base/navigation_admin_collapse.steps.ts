import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import {
  expectCollapsedNavigation,
  expectExpandedNavigation,
} from "./navigation.helpers";

Given("the navigation is collapsed", () => {
  expectCollapsedNavigation();
});

// On mobile the menu is hidden by translating it off-screen. Cypress 16's
// visibility algorithm no longer treats transform-hidden elements as hidden, so
// check the position of the menu instead of `be.visible`.
const isOnScreen = ($el: JQuery<HTMLElement>) => {
  const { left, right } = $el[0].getBoundingClientRect();
  return right > 0 && left < Cypress.config("viewportWidth");
};

Given("the main navigation should not be visible", () => {
  cy.getMainNavigation().should(($el) => {
    expect(isOnScreen($el), "main navigation is on screen").to.equal(false);
  });
});

When("the user presses {string} key", (key: string) => {
  cy.get("body").type(key);
});

When(
  "the user clicks the {string} button in the navigation banner",
  (buttonName: string) => {
    cy.findByRole("banner", { name: "navigation" }).within(() =>
      cy.findByRole("button", { name: buttonName }).click()
    );
  }
);

When(
  "the user clicks the {string} button in the main navigation",
  (buttonName: string) => {
    cy.getMainNavigation()
      .should("be.visible")
      .within(() =>
        cy
          .findByRole("button", { name: new RegExp(buttonName, "i") })
          .focus()
          .click()
      );
  }
);

Then("the navigation is expanded", () => {
  expectExpandedNavigation();
});

Then("the main navigation should be visible", () => {
  cy.getMainNavigation().should(($el) => {
    expect(isOnScreen($el), "main navigation is on screen").to.equal(true);
  });
});

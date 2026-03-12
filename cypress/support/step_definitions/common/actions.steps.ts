import { When } from "@badeball/cypress-cucumber-preprocessor";

When("the user clicks the {string} button", (button: string) => {
  cy.findByRole("button", { name: button }).click();
});

When("the user clicks the button matching {string}", (button: string) => {
  cy.findByRole("button", { name: new RegExp(button, "i") }).click();
});

When("the user clicks the {string} link", (link: string) => {
  cy.findByRole("link", { name: link }).click();
});

When(
  "the user clicks the {string} link in the main navigation",
  (linkName: string) => {
    cy.getMainNavigation()
      .should("be.visible")
      .within(() =>
        cy.findByRole("link", { name: new RegExp(linkName, "i") }).click()
      );
  }
);

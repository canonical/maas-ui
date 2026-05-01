import { When } from "@badeball/cypress-cucumber-preprocessor";

When("the user clicks the {string} button", (button: string) => {
  cy.findByRole("button", { name: button }).click();
});

When("the user clicks the button matching {string}", (button: string) => {
  cy.findByRole("button", { name: new RegExp(button, "i") }).click();
});

When("the user submits the form", () => {
  cy.get("button[type='submit']").click();
});

When("the user clicks the {string} link", (link: string) => {
  // The default DNS domain row is rendered as "maas" even when test text uses
  // "maas(default)" or "maas (default)".
  if (/^maas\s*\(default\)$/i.test(link)) {
    cy.findByRole("grid", { name: "Domains table" }).within(() => {
      cy.get("[data-testid='domain-name']").first().click();
    });

    return;
  }

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

When("the user refreshes the page", () => {
  cy.reload(true);
});

When("the user presses the {string} key", (key: string) => {
  cy.get("body").type(`{${key}}`);
});

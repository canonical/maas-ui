import { generateMAASURL } from "../../../utils";

context("Settings - General - Theme", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/settings/configuration/general"));

    cy.findByRole("radio", { name: "Default" }).click();

    cy.findByRole("button", { name: "Save" }).then(($btn) => {
      if ($btn.is(":disabled")) {
        return;
      } else {
        cy.wrap($btn).click();
      }
    });
  });

  it("displays a live preview of a MAAS theme colour", () => {
    cy.findByRole("radio", { name: "Red" }).click();
    cy.get(".l-navigation").should("have.class", "l-navigation--red");
  });

  it("persists the theme choice after saving and refreshing the page", () => {
    cy.findByRole("radio", { name: "Red" }).click();
    cy.findByRole("button", { name: "Save" }).click();

    cy.findByRole("button", { name: "Save" }).should("be.disabled");

    cy.reload(true);

    cy.get(".l-navigation").should("have.class", "l-navigation--red");
  });

  it("persists the theme choice after saving and navigating away from page", () => {
    cy.findByRole("radio", { name: "Red" }).click();
    cy.findByRole("button", { name: "Save" }).click();

    cy.findByRole("button", { name: "Save" }).should("be.disabled");

    cy.findByRole("link", { name: "Deploy" }).click();

    cy.get(".l-navigation").should("have.class", "l-navigation--red");
  });

  it("reverts the theme choice if not saved and page is refreshed", () => {
    cy.findByRole("radio", { name: "Red" }).click();
    cy.reload(true);

    cy.get(".l-navigation").should("have.class", "is-maas-default");
  });

  it("reverts the theme choice if the user clicks cancel", () => {
    cy.findByRole("radio", { name: "Red" }).click();
    cy.findByRole("button", { name: "Cancel" }).click();

    cy.get(".l-navigation").should("have.class", "is-maas-default");
  });

  it("reverts the theme choice if the user navigates to another page", () => {
    cy.findByRole("radio", { name: "Red" }).click();
    cy.findByRole("link", { name: "Deploy" }).click();

    cy.get(".l-navigation").should("have.class", "is-maas-default");
  });
});

context("Settings - General", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/settings/configuration/general"));
  });

  it("resets to initial values on cancel", () => {
    const getNotificationsCheckbox = () =>
      cy.findByLabelText(/Enable new release notifications/);

    getNotificationsCheckbox().should("be.checked");
    getNotificationsCheckbox().click({ force: true });
    getNotificationsCheckbox().should("not.be.checked");

    cy.findByRole("button", { name: "Cancel" }).click();
    getNotificationsCheckbox().should("be.checked");
  });
});

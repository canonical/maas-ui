import { generateLegacyURL, generateNewURL } from "@maas-ui/maas-ui-shared";

import { login } from "../utils";

context("Header", () => {
  beforeEach(() => {
    login();
    // Need the window to be wide enough so that menu items aren't hidden under
    // the hardware menu.
    cy.viewport("macbook-13");
    cy.setCookie("skipintro", "true");
    cy.visit(generateNewURL("/"));
  });

  afterEach(() => {
    cy.clearCookie("skipintro");
  });

  it("navigates to the dashboard when clicking on the logo", () => {
    cy.get(".p-navigation__logo .p-navigation__link").click();
    cy.location("pathname").should("eq", generateLegacyURL("/dashboard"));
    cy.get(".p-navigation__link.is-selected a").should("not.exist");
  });

  it("navigates to machines", () => {
    cy.get(".p-navigation__link a:contains(Machines)").click();
    cy.location("pathname").should("eq", generateNewURL("/machines"));
    cy.get(".p-navigation__link.is-selected a").contains("Machines");
  });

  it("navigates to devices", () => {
    cy.get(".p-navigation__link a:contains(Devices)").click();
    cy.location("pathname").should("eq", generateLegacyURL("/devices"));
    cy.get(".p-navigation__link.is-selected a").contains("Devices");
  });

  it("navigates to controllers", () => {
    cy.get(".p-navigation__link a:contains(Controllers)").click();
    cy.location("pathname").should("eq", generateLegacyURL("/controllers"));
    cy.get(".p-navigation__link.is-selected a").contains("Controllers");
  });

  it("navigates to kvm", () => {
    cy.get(".p-navigation__link a:contains(KVM)").click();
    cy.location("pathname").should("eq", generateNewURL("/kvm"));
    cy.get(".p-navigation__link.is-selected a").contains("KVM");
  });

  it("navigates to images", () => {
    cy.get(".p-navigation__link a:contains(Images)").click();
    cy.location("pathname").should("eq", generateLegacyURL("/images"));
    cy.get(".p-navigation__link.is-selected a").contains("Images");
  });

  it("navigates to domains", () => {
    cy.get(".p-navigation__link a:contains(DNS)").click();
    cy.location("pathname").should("eq", generateLegacyURL("/domains"));
    cy.get(".p-navigation__link.is-selected a").contains("DNS");
  });

  it("navigates to zones", () => {
    cy.get(".p-navigation__link a:contains(AZs)").click();
    cy.location("pathname").should("eq", generateLegacyURL("/zones"));
    cy.get(".p-navigation__link.is-selected a").contains("AZs");
  });

  it("navigates to subnets", () => {
    cy.get(".p-navigation__link a:contains(Subnets)").click();
    cy.location("pathname").should("eq", generateLegacyURL("/networks"));
    cy.location("search").should("eq", "?by=fabric");
    cy.get(".p-navigation__link.is-selected a").contains("Subnets");
  });

  it("navigates to settings", () => {
    cy.get(".p-navigation__link a:contains(Settings)").click();
    cy.location("pathname").should(
      "eq",
      generateNewURL("/settings/configuration/general")
    );
    cy.get(".p-navigation__link.is-selected a").contains("Settings");
  });

  it("navigates to preferences", () => {
    cy.get(
      `.p-navigation__link a:contains(${Cypress.env("username")})`
    ).click();
    cy.location("pathname").should(
      "eq",
      generateNewURL("/account/prefs/details")
    );
    cy.get(".p-navigation__link.is-selected a").contains(
      Cypress.env("username")
    );
  });
});

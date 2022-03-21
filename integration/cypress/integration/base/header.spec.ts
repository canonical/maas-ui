import { generateNewURL } from "@maas-ui/maas-ui-shared";

context("Header", () => {
  beforeEach(() => {
    cy.login();
    // Need the window to be wide enough so that menu items aren't hidden under
    // the hardware menu.
    cy.viewport("macbook-13");
    cy.visit(generateNewURL("/"));
  });

  it("navigates to the machine list when clicking on the logo as a non admin", () => {
    cy.get(".p-navigation__logo a").click();
    cy.location("pathname").should("eq", generateNewURL("/machines"));
    cy.get(".p-navigation__item.is-selected a").contains("Machines");
  });

  it("navigates to machines", () => {
    cy.get(".p-navigation__link:contains(Machines)").click();
    cy.location("pathname").should("eq", generateNewURL("/machines"));
    cy.get(".p-navigation__item.is-selected a").contains("Machines");
  });

  it("navigates to devices", () => {
    cy.get(".p-navigation__link:contains(Devices)").click();
    cy.location("pathname").should("eq", generateNewURL("/devices"));
    cy.get(".p-navigation__item.is-selected a").contains("Devices");
  });

  it("navigates to controllers", () => {
    cy.get(".p-navigation__link:contains(Controllers)").click();
    cy.location("pathname").should("eq", generateNewURL("/controllers"));
    cy.get(".p-navigation__item.is-selected a").contains("Controllers");
  });

  it("navigates to lxd kvm list", () => {
    cy.get(".p-navigation__link:contains(KVM)").click();
    cy.location("pathname").should("eq", generateNewURL("/kvm/lxd"));
    cy.get(".p-navigation__item.is-selected a").contains("KVM");
  });

  it("navigates to images", () => {
    cy.get(".p-navigation__link:contains(Images)").click();
    cy.location("pathname").should("eq", generateNewURL("/images"));
    cy.get(".p-navigation__item.is-selected a").contains("Images");
  });

  it("navigates to domains", () => {
    cy.get(".p-navigation__link:contains(DNS)").click();
    cy.location("pathname").should("eq", generateNewURL("/domains"));
    cy.get(".p-navigation__item.is-selected a").contains("DNS");
  });

  it("navigates to zones", () => {
    cy.get(".p-navigation__link:contains(AZs)").click();
    cy.location("pathname").should("eq", generateNewURL("/zones"));
    cy.get(".p-navigation__item.is-selected a").contains("AZs");
  });

  it("navigates to subnets", () => {
    cy.get(".p-navigation__link:contains(Subnets)").click();
    cy.location("pathname").should("eq", generateNewURL("/networks"));
    cy.location("search").should("eq", "?by=fabric");
    cy.get(".p-navigation__item.is-selected a").contains("Subnets");
  });

  it("navigates to settings", () => {
    cy.get(".p-navigation__link:contains(Settings)").click();
    cy.location("pathname").should(
      "eq",
      generateNewURL("/settings/configuration/general")
    );
    cy.get(".p-navigation__item.is-selected a").contains("Settings");
  });

  it("navigates to preferences", () => {
    cy.get(`.p-navigation__link:contains(${Cypress.env("username")})`).click();
    cy.location("pathname").should(
      "eq",
      generateNewURL("/account/prefs/details")
    );
    cy.get(".p-navigation__item.is-selected a").contains(
      Cypress.env("username")
    );
  });
});

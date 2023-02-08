import { generateMAASURL } from "../../utils";

context("Header - non-admin", () => {
  beforeEach(() => {
    cy.loginNonAdmin();
    cy.visit(generateMAASURL("/"));
  });

  it("navigates to machines when clicking on the logo", () => {
    cy.findByRole("link", { name: "Homepage" }).click();
    cy.location("pathname").should("eq", generateMAASURL("/machines"));
    cy.get(".p-navigation__item.is-selected a").contains("Machines");
  });
});

context("Header - admin", () => {
  beforeEach(() => {
    cy.login();
    // Need the window to be wide enough so that menu items aren't hidden under
    // the hardware menu.
    cy.viewport("macbook-13");
    cy.visit(generateMAASURL("/"));
  });

  it("navigates to dashboard when clicking on the logo", () => {
    cy.waitForPageToLoad();
    cy.findByRole("link", { name: "Homepage" }).click();
    cy.location("pathname").should("eq", generateMAASURL("/dashboard"));
    cy.findByRole("link", { current: "page", name: "Homepage" }).should(
      "exist"
    );
  });

  it("navigates to machines", () => {
    cy.get(".p-navigation__link:contains(Machines)").click();
    cy.location("pathname").should("eq", generateMAASURL("/machines"));
    cy.get(".p-navigation__item.is-selected a").contains("Machines");
  });

  it("navigates to devices", () => {
    cy.get(".p-navigation__link:contains(Devices)").click();
    cy.location("pathname").should("eq", generateMAASURL("/devices"));
    cy.get(".p-navigation__item.is-selected a").contains("Devices");
  });

  it("navigates to controllers", () => {
    cy.get(".p-navigation__link:contains(Controllers)").click();
    cy.location("pathname").should("eq", generateMAASURL("/controllers"));
    cy.get(".p-navigation__item.is-selected a").contains("Controllers");
  });

  it("navigates to lxd kvm list", () => {
    cy.get(".p-navigation__link:contains(KVM)").click();
    cy.location("pathname").should("eq", generateMAASURL("/kvm/lxd"));
    cy.get(".p-navigation__item.is-selected a").contains("KVM");
  });

  it("navigates to images", () => {
    cy.get(".p-navigation__link:contains(Images)").click();
    cy.location("pathname").should("eq", generateMAASURL("/images"));
    cy.get(".p-navigation__item.is-selected a").contains("Images");
  });

  it("navigates to domains", () => {
    cy.get(".p-navigation__link:contains(DNS)").click();
    cy.location("pathname").should("eq", generateMAASURL("/domains"));
    cy.get(".p-navigation__item.is-selected a").contains("DNS");
  });

  it("navigates to zones", () => {
    cy.get(".p-navigation__link:contains(AZs)").click();
    cy.location("pathname").should("eq", generateMAASURL("/zones"));
    cy.get(".p-navigation__item.is-selected a").contains("AZs");
  });

  it("navigates to subnets", () => {
    cy.get(".p-navigation__link:contains(Subnets)").click();
    cy.location("pathname").should("eq", generateMAASURL("/networks"));
    cy.location("search").should("eq", "?by=fabric&q=");
    cy.get(".p-navigation__item.is-selected a").contains("Subnets");
  });

  it("navigates to settings", () => {
    cy.get(".p-navigation__link:contains(Settings)").click();
    cy.location("pathname").should(
      "eq",
      generateMAASURL("/settings/configuration/general")
    );
    cy.get(".p-navigation__item.is-selected a").contains("Settings");
  });

  it("navigates to preferences", () => {
    cy.get(`.p-navigation__link:contains(${Cypress.env("username")})`).click();
    cy.location("pathname").should(
      "eq",
      generateMAASURL("/account/prefs/details")
    );
    cy.get(".p-navigation__item.is-selected a").contains(
      Cypress.env("username")
    );
  });

  it("opens and closes the menu on mobile", () => {
    cy.viewport("iphone-8");
    const getMainNavigation = () =>
      cy.findByRole("navigation", {
        name: /main navigation/i,
      });
    getMainNavigation().should("not.be.visible");
    cy.findByRole("banner").within(() =>
      cy.findByRole("button", { name: "Menu" }).click()
    );
    getMainNavigation()
      .should("be.visible")
      .within(() => cy.findByRole("button", { name: /Close/i }).click());
    getMainNavigation().should("not.be.visible");
  });
});

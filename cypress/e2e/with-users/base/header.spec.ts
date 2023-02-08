import { generateMAASURL } from "../../utils";

context("Header - non-admin", () => {
  beforeEach(() => {
    cy.loginNonAdmin();
    cy.visit(generateMAASURL("/"));
  });

  it("navigates to machines when clicking on the logo", () => {
    cy.findByRole("link", { name: "Homepage" }).click();
    cy.location("pathname").should("eq", generateMAASURL("/machines"));
    cy.get(".l-navigation__item.is-selected a").contains("Machines");
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
    cy.get(".l-navigation__link:contains(Machines)").click();
    cy.location("pathname").should("eq", generateMAASURL("/machines"));
    cy.get(".l-navigation__item.is-selected a").contains("Machines");
  });

  it("navigates to devices", () => {
    cy.get(".l-navigation__link:contains(Devices)").click();
    cy.location("pathname").should("eq", generateMAASURL("/devices"));
    cy.get(".l-navigation__item.is-selected a").contains("Devices");
  });

  it("navigates to controllers", () => {
    cy.get(".l-navigation__link:contains(Controllers)").click();
    cy.location("pathname").should("eq", generateMAASURL("/controllers"));
    cy.get(".l-navigation__item.is-selected a").contains("Controllers");
  });

  it("navigates to lxd kvm list", () => {
    cy.get(".l-navigation__link:contains(LXD)").click();
    cy.location("pathname").should("eq", generateMAASURL("/kvm/lxd"));
    cy.get(".l-navigation__item.is-selected a").contains("LXD");
  });

  it("navigates to virsh kvm list", () => {
    cy.get(".l-navigation__link:contains(Virsh)").click();
    cy.location("pathname").should("eq", generateMAASURL("/kvm/virsh"));
    cy.get(".l-navigation__item.is-selected a").contains("Virsh");
  });

  it("navigates to images", () => {
    cy.get(".l-navigation__link:contains(Images)").click();
    cy.location("pathname").should("eq", generateMAASURL("/images"));
    cy.get(".l-navigation__item.is-selected a").contains("Images");
  });

  it("navigates to domains", () => {
    cy.get(".l-navigation__link:contains(DNS)").click();
    cy.location("pathname").should("eq", generateMAASURL("/domains"));
    cy.get(".l-navigation__item.is-selected a").contains("DNS");
  });

  it("navigates to zones", () => {
    cy.get(".l-navigation__link:contains(AZs)").click();
    cy.location("pathname").should("eq", generateMAASURL("/zones"));
    cy.get(".l-navigation__item.is-selected a").contains("AZs");
  });

  it("navigates to subnets", () => {
    cy.get(".l-navigation__link:contains(Subnets)").click();
    cy.location("pathname").should("eq", generateMAASURL("/networks"));
    cy.location("search").should("eq", "?by=fabric&q=");
    cy.get(".l-navigation__item.is-selected a").contains("Subnets");
  });

  it("navigates to settings", () => {
    cy.get(".l-navigation__link:contains(Settings)").click();
    cy.location("pathname").should(
      "eq",
      generateMAASURL("/settings/configuration/general")
    );
    cy.get(".l-navigation__item.is-selected a").contains("Settings");
  });

  it("navigates to preferences", () => {
    cy.get(`.l-navigation__link:contains(${Cypress.env("username")})`).click();
    cy.location("pathname").should(
      "eq",
      generateMAASURL("/account/prefs/details")
    );
    cy.get(".l-navigation__item.is-selected a").contains(
      Cypress.env("username")
    );
  });
});

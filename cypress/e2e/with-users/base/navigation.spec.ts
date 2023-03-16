import { generateMAASURL } from "../../utils";

const expectCollapsedNavigation = () => {
  cy.findByRole("navigation", { name: /main navigation/i })
    .invoke("width")
    .should("equal", 64);
  cy.findByRole("navigation", { name: /main navigation/i }).within(() =>
    cy.findByRole("link", { name: /machines/i }).should("not.exist")
  );
};
const expectExpandedNavigation = () => {
  cy.findByRole("navigation", { name: /main navigation/i })
    .invoke("width")
    .should("equal", 240);
  cy.findByRole("navigation", { name: /main navigation/i }).within(() =>
    cy.findByRole("link", { name: /machines/i }).should("exist")
  );
};

context("Navigation - non-admin", () => {
  beforeEach(() => {
    cy.loginNonAdmin();
    cy.visit(generateMAASURL("/"));
  });

  it("navigates to machines when clicking on the logo", () => {
    cy.getMainNavigation().within(() =>
      cy.findByRole("link", { name: "Homepage" }).click()
    );
    cy.location("pathname").should("eq", generateMAASURL("/machines"));
    cy.get(".p-side-navigation__item.is-selected a").contains("Machines");
  });
});

context("Navigation - admin - collapse", () => {
  beforeEach(() => {
    cy.login();
    // Need the window to be wide enough so that menu items aren't hidden under
    // the hardware menu.
    cy.viewport("macbook-13");
    cy.visit(generateMAASURL("/"));
  });

  it("expands and collapses the side navigation using a keyboard shortcut", () => {
    cy.viewport("ipad-mini");
    cy.waitForPageToLoad();
    expectCollapsedNavigation();
    cy.get("body").type("[");
    expectExpandedNavigation();
    cy.get("body").type("[");
    expectCollapsedNavigation();
  });

  it("expands and collapses the side navigation on click of a button", () => {
    cy.viewport("ipad-mini");
    cy.waitForPageToLoad();
    expectCollapsedNavigation();
    cy.findByRole("button", { name: /expand main navigation/ }).click();
    expectExpandedNavigation();
    cy.findByRole("button", { name: /collapse main navigation/ }).click();
    expectCollapsedNavigation();
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
      .within(() =>
        cy.findByRole("button", { name: /collapse main navigation/ }).click()
      );
    getMainNavigation().should("not.be.visible");
  });
});

context("Navigation - admin", () => {
  beforeEach(() => {
    cy.login();
    // Need the window to be wide enough so that menu items aren't hidden under
    // the hardware menu.
    cy.viewport("macbook-13");
    cy.visit(generateMAASURL("/"));
    // set side navigation to expanded
    cy.expandMainNavigation();
  });

  const expected = [
    { destinationUrl: "/machines", linkLabel: "Machines" },
    { destinationUrl: "/devices", linkLabel: "Devices" },
    { destinationUrl: "/controllers", linkLabel: "Controllers" },
    { destinationUrl: "/kvm/lxd", linkLabel: "LXD" },
    { destinationUrl: "/images", linkLabel: "Images" },
    { destinationUrl: "/domains", linkLabel: "DNS" },
    { destinationUrl: "/networks", linkLabel: "Subnets" },
    {
      destinationUrl: "/settings/configuration/general",
      linkLabel: "Settings",
    },
    {
      destinationUrl: "/account/prefs/details",
      linkLabel: Cypress.env("username"),
    },
    { destinationUrl: "/zones", linkLabel: "AZs" },
  ];

  it("navigates to /dashboard when clicking on the logo", () => {
    cy.waitForPageToLoad();
    cy.getMainNavigation().within(() =>
      cy.findByRole("link", { name: "Homepage" }).click()
    );
    cy.location("pathname").should("eq", generateMAASURL("/dashboard"));
  });

  expected.forEach(({ destinationUrl, linkLabel }) => {
    it(`navigates to ${destinationUrl} and highlights ${linkLabel} link`, () => {
      cy.waitForPageToLoad();
      cy.getMainNavigation().within(() =>
        cy.findByRole("link", { name: linkLabel }).click()
      );
      cy.location("pathname").should("eq", generateMAASURL(destinationUrl));
      cy.get(".p-side-navigation__item.is-selected a").contains(linkLabel);
      cy.findByRole("link", { current: "page" }).should("have.text", linkLabel);
    });
  });
});

import { generateMAASURL } from "../../utils";

const expectCollapsedNavigation = () => {
  cy.getMainNavigation().invoke("width").should("equal", 64);
  cy.getMainNavigation().within(() =>
    cy.findByRole("link", { name: /machines/i }).should("not.exist")
  );
};
const expectExpandedNavigation = () => {
  cy.getMainNavigation().invoke("width").should("equal", 240);
  cy.getMainNavigation().within(() =>
    cy.findByRole("link", { name: /machines/i }).should("exist")
  );
};

context("Navigation - non-admin", () => {
  before(() => {
    cy.session("non-admin", () => {
      cy.loginNonAdmin();
    });
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
  before(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.viewport("macbook-13");
    cy.visit(generateMAASURL("/"));
  });

  beforeEach(() => {
    cy.viewport("ipad-mini");
  });

  it("expands and collapses the side navigation using a keyboard shortcut", () => {
    cy.waitForPageToLoad();
    expectCollapsedNavigation();
    cy.get("body").type("[");
    expectExpandedNavigation();
    cy.get("body").type("[");
    expectCollapsedNavigation();
  });

  it("ignores the keyboard shortcut when modifier key is pressed", () => {
    cy.waitForPageToLoad();
    expectCollapsedNavigation();
    cy.get("body").type("{ctrl}[");
    expectCollapsedNavigation();
  });

  it("expands and collapses the side navigation on click of a button", () => {
    cy.waitForPageToLoad();
    expectCollapsedNavigation();
    cy.findByRole("button", { name: /expand main navigation/ }).click();
    expectExpandedNavigation();
    cy.findByRole("button", { name: /collapse main navigation/ }).click();
    expectCollapsedNavigation();
  });

  it("opens and closes the menu on mobile", () => {
    cy.viewport("iphone-8");
    cy.getMainNavigation().should("not.be.visible");
    cy.findByRole("banner", { name: "navigation" }).within(() =>
      cy.findByRole("button", { name: "Menu" }).click()
    );
    cy.getMainNavigation()
      .should("be.visible")
      .within(() => cy.findByRole("button", { name: /close menu/i }).click());
    cy.getMainNavigation().should("not.be.visible");
  });

  it("automatically closes the menu on mobile when a link is clicked", () => {
    cy.viewport("iphone-8");
    cy.getMainNavigation().should("not.be.visible");
    cy.findByRole("banner", { name: "navigation" }).within(() =>
      cy.findByRole("button", { name: "Menu" }).click()
    );
    cy.getMainNavigation()
      .should("be.visible")
      .within(() => cy.findByRole("link", { name: /devices/i }).click());
    cy.getMainNavigation().should("not.be.visible");
  });
});

context("Navigation - admin", () => {
  before(() => {
    cy.session("admin", () => {
      cy.login();
    });
    cy.viewport("macbook-13");
    cy.visit(generateMAASURL("/"));
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

  it("navigates to machines when clicking on the logo", () => {
    cy.waitForPageToLoad();
    cy.getMainNavigation().within(() =>
      cy.findByRole("link", { name: "Homepage" }).click()
    );
    cy.location("pathname").should("eq", generateMAASURL("/machines"));
  });

  expected.forEach(({ destinationUrl, linkLabel }) => {
    it(`navigates to ${destinationUrl} and highlights ${linkLabel} link`, () => {
      cy.waitForPageToLoad();
      cy.getMainNavigation().within(() =>
        cy.findByRole("link", { name: linkLabel }).click()
      );
      cy.location("pathname").should("eq", generateMAASURL(destinationUrl));
      cy.get(".p-side-navigation__item.is-selected a").contains(linkLabel);
      cy.findAllByRole("link", {
        current: "page",
        name: linkLabel,
      }).should("exist");
    });
  });
});

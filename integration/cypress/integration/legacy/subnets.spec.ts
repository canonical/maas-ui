import { generateLegacyURL } from "@maas-ui/maas-ui-shared";

context("Subnets", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateLegacyURL("/networks?by=fabric"));
    cy.viewport("macbook-11");
  });

  it("renders the correct heading", () => {
    cy.findByRole("heading", { level: 1 }).contains("Subnets");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__link.is-selected a").should(
      "have.attr",
      "href",
      generateLegacyURL("/networks?by=fabric")
    );
    cy.findByRole("navigation", { name: "primary" }).within(() => {
      cy.findByRole("link", { current: "page" }).should(
        "have.attr",
        "href",
        generateLegacyURL("/networks?by=fabric")
      );
    });
  });

  it("displays the main networking view correctly", () => {
    const expectedHeaders = [
      "Fabric",
      "VLAN",
      "DHCP",
      "Subnet",
      "Available IPs",
      "Space",
    ];
    cy.findByRole("table", { name: "Subnets" }).within(() => {
      expectedHeaders.forEach((name) => {
        cy.findByRole("columnheader", { name }).should("exist");
      });
    });
  });

  it("allows filtering by 'fabrics' or 'spaces' via the 'Group by' drop-down", () => {
    cy.findByRole("table", { name: "Subnets" }).within(() => {
      cy.findAllByRole("columnheader").first().should("have.text", "Fabric");
    });
    cy.findByRole("combobox", { name: "Group by" })
      .within(() => {
        cy.findByRole("option", { selected: true }).contains("Fabrics");
        cy.findByRole("option", { name: "Spaces" }).should("exist");
      })
      .select("Spaces");
    cy.findByRole("table", { name: "Subnets" }).within(() => {
      cy.findAllByRole("columnheader").first().should("have.text", "Space");
    });
  });
});

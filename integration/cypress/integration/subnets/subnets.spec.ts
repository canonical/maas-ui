import { generateNewURL } from "@maas-ui/maas-ui-shared";

context("Subnets", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateNewURL("/networks?by=fabric"));
    cy.viewport("macbook-11");
  });

  it("renders the correct heading", () => {
    cy.findByRole("heading", { level: 1 }).contains("Subnets");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__item.is-selected a").should(
      "have.attr",
      "href",
      generateNewURL("/networks?by=fabric")
    );
    cy.findByRole("navigation", { name: "primary" }).within(() => {
      cy.findByRole("link", { current: "page" }).should(
        "have.attr",
        "href",
        generateNewURL("/networks?by=fabric")
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

  it("updates the URL to default grouping if no group paramater has been set", () => {
    cy.visit(generateNewURL("/networks"));

    cy.findByRole("combobox", { name: "Group by" }).within(() => {
      cy.findByRole("option", { selected: true }).contains("Fabric");
    });

    cy.url().should("include", generateNewURL("/networks?by=fabric"));
  });

  it("allows grouping by fabric and space", () => {
    cy.findByRole("table", { name: "Subnets" }).within(() => {
      cy.findAllByRole("columnheader").first().should("have.text", "Fabric");
    });

    cy.findByRole("combobox", { name: "Group by" }).within(() => {
      cy.findByRole("option", { selected: true }).contains("Fabric");
      cy.findByRole("option", { selected: false }).contains("Space");
    });

    cy.findByRole("combobox", { name: "Group by" }).select("Space");

    cy.findByRole("table", { name: "Subnets" }).within(() => {
      cy.findAllByRole("columnheader").first().should("have.text", "Space");
    });

    cy.url().should("include", generateNewURL("/networks?by=space"));
  });
});

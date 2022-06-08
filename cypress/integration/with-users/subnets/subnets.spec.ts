import { generateMAASURL } from "../../utils";

context("Subnets", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/networks?by=fabric"));
    cy.viewport("macbook-11");
  });

  it("renders the correct heading", () => {
    cy.findByRole("heading", { level: 1 }).contains("Subnets");
  });

  it("highlights the correct navigation link", () => {
    cy.get(".p-navigation__item.is-selected a").should(
      "have.attr",
      "href",
      generateMAASURL("/networks?by=fabric")
    );
    cy.findByRole("navigation", { name: "primary" }).within(() => {
      cy.findByRole("link", { current: "page" }).should(
        "have.attr",
        "href",
        generateMAASURL("/networks?by=fabric")
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

    cy.findByRole("table", { name: "Subnets by Fabric" }).within(() => {
      expectedHeaders.forEach((name) => {
        cy.findByRole("columnheader", { name }).should("exist");
      });
    });
  });

  it("updates the URL to default grouping if no group paramater has been set", () => {
    cy.visit(generateMAASURL("/networks"));

    cy.findByRole("combobox", { name: "Group by" }).within(() => {
      cy.findByRole("option", { selected: true }).contains("Group by fabric");
    });

    cy.url().should("include", generateMAASURL("/networks?by=fabric"));
  });

  it("allows grouping by fabric and space", () => {
    cy.findByRole("table", { name: "Subnets by Fabric" }).within(() => {
      cy.findAllByRole("columnheader").first().should("have.text", "Fabric");
    });

    cy.findByRole("combobox", { name: "Group by" }).within(() => {
      cy.findByRole("option", { selected: true }).contains("Group by fabric");
      cy.findByRole("option", { selected: false }).contains("Group by space");
    });

    cy.findByRole("combobox", { name: "Group by" }).select("Group by space");

    cy.findByRole("table", { name: "Subnets by Space" }).within(() => {
      cy.findAllByRole("columnheader").first().should("have.text", "Space");
    });

    cy.url().should("include", generateMAASURL("/networks?by=space"));
  });
});

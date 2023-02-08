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
    cy.get(".l-navigation__item.is-selected a").should(
      "have.attr",
      "href",
      generateMAASURL("/networks")
    );
    cy.get(".l-navigation").within(() => {
      cy.findByRole("link", { current: "page" }).should(
        "have.attr",
        "href",
        generateMAASURL("/networks")
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

    cy.findByRole("tab", { name: /fabric/i }).should(
      "have.attr",
      "aria-selected",
      "true"
    );

    cy.url().should("include", generateMAASURL("/networks?by=fabric"));
  });

  it("allows grouping by fabric and space", () => {
    cy.findByRole("table", { name: "Subnets by Fabric" }).within(() => {
      cy.findAllByRole("columnheader").first().should("have.text", "Fabric");
    });

    cy.findByRole("tab", { name: /fabric/i }).should(
      "have.attr",
      "aria-selected",
      "true"
    );
    cy.findByRole("tab", { name: /space/i }).should(
      "have.attr",
      "aria-selected",
      "false"
    );

    cy.findByRole("tab", { name: /space/i }).click();

    cy.findByRole("table", { name: "Subnets by Space" }).within(() => {
      cy.findAllByRole("columnheader").first().should("have.text", "Space");
    });

    cy.url().should("include", generateMAASURL("/networks?by=space"));
  });
});

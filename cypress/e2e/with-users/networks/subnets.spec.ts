import { generateMAASURL } from "../../utils";

context("Subnets", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/networks/suubnets?by=fabric"));
    cy.waitForPageToLoad();
    cy.viewport("macbook-11");
  });

  it("renders the correct heading", () => {
    cy.findByRole("heading", { level: 1 }).contains("Networks");
  });

  it("displays the main networking view correctly", () => {
    const expectedHeaders = [
      "VLAN",
      "DHCP",
      "Subnet",
      "Available IPs",
      "Space",
    ];

    cy.findByRole("grid", { name: "Subnets by fabric" }).within(() => {
      expectedHeaders.forEach((name) => {
        cy.findByRole("columnheader", { name }).should("exist");
      });
    });
  });

  it("updates the URL to default grouping if no group paramater has been set", () => {
    cy.visit(generateMAASURL("/networks"));

    cy.findByRole("combobox", { name: /group by/i }).should(
      "have.value",
      "fabric"
    );

    cy.url().should("include", generateMAASURL("/networks/subnets?by=fabric"));
  });

  it("allows grouping by fabric and space", () => {
    cy.findByRole("grid", { name: "Subnets by fabric" }).within(() => {
      cy.get("tbody tr").first().should("include.text", "fabric");
    });

    cy.findByRole("combobox", { name: /group by/i }).should(
      "have.value",
      "fabric"
    );

    cy.findByRole("combobox", { name: /group by/i }).should(
      "not.have.value",
      "space"
    );

    cy.findByRole("combobox", { name: /group by/i }).select("space");

    cy.waitForPageToLoad();

    cy.findByRole("grid", { name: "Subnets by space" }).within(() => {
      cy.get("tbody tr").first().should("include.text", "space");
    });

    cy.url().should("include", generateMAASURL("/networks/subnets?by=space"));
  });
});

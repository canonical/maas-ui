import { generateMAASURL, generateName } from "../../utils";

context("Settings - DHCP Snippets", () => {
  beforeEach(() => {
    cy.login();
    cy.addMachine();
    cy.visit(generateMAASURL("/settings/dhcp/add"));
    cy.waitForPageToLoad();
  });

  it("can request adding a Global DHCP snippet", () => {
    const snippetName = generateName("dhcp-snippet");
    cy.findByLabelText("Snippet name").type(snippetName);
    // eslint-disable-next-line cypress/no-force
    cy.findByLabelText("Enabled").click({ force: true });
    cy.findByLabelText("Type").select("Global");
    cy.findByLabelText("DHCP snippet").type("ddns-update-style none;");
    cy.findByText(/Connection set empty/).should("not.exist");
    cy.findByRole("button", { name: "Save snippet" }).click();
    // expect an error
    cy.findByText(/Connection set empty/).should("exist");
  });

  it("can request adding of a DHCP snippet to a machine", () => {
    const snippetName = generateName("dhcp-snippet");
    cy.findByLabelText("Snippet name").type(snippetName);
    cy.findByLabelText("Type").select("Machine");
    cy.findByRole("button", { name: /Choose machine/ }).click();
    // ensure the data has loaded
    cy.findByRole("grid").should("have.attr", "aria-busy", "false");
    cy.get("tbody").within(() => {
      cy.findAllByRole("row").first().click();
    });
    cy.findByLabelText("DHCP snippet").type("ddns-update-style none;");
    cy.findByRole("button", { name: "Save snippet" }).click();
    cy.findByText(
      "Unable to validate DHCP config, no available rack controller connected."
    ).should("be.visible");
  });
});

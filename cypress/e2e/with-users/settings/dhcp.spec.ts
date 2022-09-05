import { generateMAASURL, generateName } from "../../utils";

context("Settings - DHCP Snippets", () => {
  beforeEach(() => {
    cy.login();
    cy.addMachine();
    cy.visit(generateMAASURL("/settings/dhcp/add"));
  });

  it("can add a DHCP snippet to a machine", () => {
    const snippetName = generateName("dhcp-snippet");
    cy.get("[data-testid='section-header-title']").contains("Settings");
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
    // expect to be redirected to the list page
    cy.findByLabelText("Search DHCP snippets").type(snippetName);
    cy.findByRole("grid").within(() => {
      cy.findByText(snippetName).should("be.visible");
      cy.findByRole("button", { name: /Delete/ }).click();
      cy.get("[data-testid='action-confirm']").click();
    });
  });
});

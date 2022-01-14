import { generateNewURL } from "@maas-ui/maas-ui-shared";
import { generateId } from "../utils";

context("Subnets - Add", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateNewURL("/networks?by=fabric"));
  });

  ["Space", "Fabric"].forEach((type) => {
    it(`displays an error when trying to add a ${type} with a name that already exists`, () => {
      const name = `cypress-${generateId()}`;

      const completeForm = () => {
        cy.findByRole("button", { name: "Add" }).click();
        cy.findByRole("button", { name: type }).click();
        cy.findByRole("textbox", { name: "Name (optional)" }).type(name);
        cy.findByRole("button", { name: `Add ${type}` }).click();
      };

      completeForm();
      completeForm();

      cy.findByText(/this Name already exists/).should("be.visible");
    });
  });

  it("displays an error when trying to add a VLAN with a VID that already exists", () => {
    const VID = `${Math.floor(Math.random() * 100)}`;

    const completeForm = () => {
      cy.findByRole("button", { name: "Add" }).click();
      cy.findByRole("button", { name: "VLAN" }).click();
      cy.findByRole("textbox", { name: "VID" }).type(VID);
      cy.findByRole("button", { name: "Add VLAN" }).click();
    };

    completeForm();
    completeForm();

    cy.findByText(
      /A VLAN with the specified VID already exists in the destination fabric./
    ).should("exist");
  });
});

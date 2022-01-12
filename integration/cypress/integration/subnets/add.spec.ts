import { generateNewURL } from "@maas-ui/maas-ui-shared";
import { generateId } from "../utils";

context("Subnets - Add Fabric", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateNewURL("/networks?by=fabric"));
  });

  it("displays an error when trying to add a fabric with a name that already exists", () => {
    const fabricName = `cypress-fabric-${generateId()}`;

    cy.findByRole("button", { name: "Add" }).click();
    cy.findByRole("button", { name: "Fabric" }).click();
    cy.findByRole("textbox", { name: "Name (optional)" }).type(fabricName);
    cy.findByRole("button", { name: /Add Fabric/ }).click();

    cy.waitUntil(() =>
      cy
        .findByRole("textbox", { name: "Name (optional)" })
        .should("not.be.disabled")
    );

    cy.findByRole("textbox", { name: "Name (optional)" }).type(fabricName);
    cy.findByRole("button", { name: /Add Fabric/ }).click();

    cy.findByText(/Fabric with this Name already exists/).should("exist");
  });
});

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

      cy.findByRole("button", { name: "Add" }).click();
      cy.findByRole("button", { name: type }).click();
      cy.findByRole("textbox", { name: "Name (optional)" }).type(name);
      cy.findByRole("button", { name: `Add ${type}` }).click();

      cy.waitUntil(() =>
        cy
          .findByRole("textbox", { name: "Name (optional)" })
          .should("not.be.disabled")
      );

      cy.findByRole("textbox", { name: "Name (optional)" }).type(name);
      cy.findByRole("button", { name: `Add ${type}` }).click();

      cy.findByText(/this Name already exists/).should("exist");
    });
  });
});

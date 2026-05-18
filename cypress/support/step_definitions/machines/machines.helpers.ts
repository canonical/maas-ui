import { LONG_TIMEOUT } from "../../../constants";
import { generateMac, generateName } from "../../../e2e/utils";

export const completeAddMachineForm = () => {
  const name = generateName("machine");
  cy.waitForPageToLoad();
  cy.waitForTableToLoad({ name: /Machines/i });
  cy.findByRole("button", { name: "Add hardware" }).click();
  cy.findByRole("menuitem", { name: "Machine", timeout: LONG_TIMEOUT }).click();
  cy.findByLabelText("Machine name").type(name);
  cy.findByLabelText("MAC address").type(generateMac());
  cy.findByLabelText("Power type").select("Manual");
  cy.findByLabelText("Power type").blur();
  cy.findByRole("button", { name: /Save machine/i })
    .should("not.have.attr", "aria-disabled", "true")
    .and("not.be.disabled")
    .click();
  return { name };
};

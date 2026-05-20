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
  cy.get("aside#aside-panel.l-aside")
    .find('[type="submit"]')
    .should(($btn) => {
      expect($btn).to.not.have.attr("aria-disabled", "true");
    })
    .click();
  return { name };
};

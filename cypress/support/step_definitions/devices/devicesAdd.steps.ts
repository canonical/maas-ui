import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { generateMac, generateName } from "../../../e2e/utils";

let deviceName = "";

When("the user enters valid device details", () => {
  deviceName = generateName("device");
  cy.findByLabelText(/Device name/).type(deviceName);
  cy.get("input[placeholder='00:00:00:00:00:00']").type(generateMac());
});

Then("the new device should appear in the device list", () => {
  cy.findByRole("link", { name: new RegExp(deviceName, "i") }).should("exist");
});

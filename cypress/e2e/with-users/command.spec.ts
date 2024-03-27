import { generateMac, generateName } from "../utils";

it("should add a new machine via CLI", () => {
  const hostname = generateName();
  const macAddress = generateMac();
  cy.runMAASCommand(
    "machines create",
    `hostname=${hostname} mac_addresses=${macAddress} power_type=manual`
  );
});

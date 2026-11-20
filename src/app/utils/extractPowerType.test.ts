import { extractPowerType } from "./extractPowerType";

it("can extract a power type from a description", () => {
  expect(extractPowerType("The Redfish Power Driver", "redfish")).toBe("Redfish");
});

it("handles no matching power type", () => {
  expect(extractPowerType("Red Fish Power Driver", "redfish")).toBe("redfish");
});

it("handles no description", () => {
  expect(extractPowerType(null, "redfish")).toBe("redfish");
});

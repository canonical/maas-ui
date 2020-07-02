import { getPowerIcon } from "./getPowerIcon";

import { machine as machineFactory } from "testing/factories";

const machine = machineFactory();

describe("getPowerIcon", () => {
  it("correctly returns on icon", () => {
    machine.power_state = "on";
    expect(getPowerIcon(machine)).toEqual("p-icon--power-on");
  });

  it("correctly returns off icon", () => {
    machine.power_state = "off";
    expect(getPowerIcon(machine)).toEqual("p-icon--power-off");
  });

  it("correctly returns error icon", () => {
    machine.power_state = "error";
    expect(getPowerIcon(machine)).toEqual("p-icon--power-error");
  });

  it("correctly returns unknown icon", () => {
    machine.power_state = "unknown";
    expect(getPowerIcon(machine)).toEqual("p-icon--power-unknown");
    expect(getPowerIcon()).toEqual("p-icon--power-unknown");
  });

  it("correctly returns loading icon", () => {
    expect(getPowerIcon(undefined, true)).toEqual(
      "p-icon--spinner u-animation--spin"
    );
  });
});

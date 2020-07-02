import { getPowerIcon } from "./getPowerIcon";

import {
  controller as controllerFactory,
  machine as machineFactory,
} from "testing/factories";

const machine = machineFactory();
const controller = controllerFactory();

describe("getPowerIcon", () => {
  it("returns an 'on' icon for a machine with an on power state", () => {
    machine.power_state = "on";
    expect(getPowerIcon(machine)).toEqual("p-icon--power-on");
  });

  it("returns an 'off' icon for a machine with an off power state", () => {
    machine.power_state = "off";
    expect(getPowerIcon(machine)).toEqual("p-icon--power-off");
  });

  it("returns an 'error' icon for a machine with an error power state", () => {
    machine.power_state = "error";
    expect(getPowerIcon(machine)).toEqual("p-icon--power-error");
  });

  it("returns an 'unknown' icon for a machine with an unknown power state", () => {
    machine.power_state = "unknown";
    expect(getPowerIcon(machine)).toEqual("p-icon--power-unknown");
    expect(getPowerIcon()).toEqual("p-icon--power-unknown");
  });

  it("returns an 'unknown' icon for a controller", () => {
    expect(getPowerIcon(controller)).toEqual("p-icon--power-unknown");
    expect(getPowerIcon()).toEqual("p-icon--power-unknown");
  });

  it("returns a loading icon if loading", () => {
    expect(getPowerIcon(undefined, true)).toEqual(
      "p-icon--spinner u-animation--spin"
    );
  });
});

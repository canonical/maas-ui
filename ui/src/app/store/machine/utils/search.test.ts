import { getMachineValue } from "./search";

import { machine as machineFactory } from "testing/factories";

describe("getMachineValue", () => {
  it("can get an attribute via a mapping function", () => {
    const machine = machineFactory({ hostname: "machine1" });
    expect(getMachineValue(machine, "hostname")).toBe("machine1");
  });

  it("can get an attribute directly from the machine", () => {
    const machine = machineFactory({ id: 808 });
    expect(getMachineValue(machine, "id")).toBe(808);
  });

  it("can get an attribute that is an array directly from the machine", () => {
    const machine = machineFactory({ link_speeds: [1, 2] });
    expect(getMachineValue(machine, "link_speeds")).toStrictEqual([1, 2]);
  });

  it("can get a workload annotation value", () => {
    const machine = machineFactory({
      workload_annotations: { type: "production" },
    });
    expect(getMachineValue(machine, "workload-type")).toBe("production");
  });
});

import { isEphemerallyDeployed } from "./IsEphemerallyDeployed";

import type { Machine } from "app/store/machine/types";
import { NodeStatusCode } from "app/store/types/node";
import { machine as machineFactory } from "testing/factories";

describe("isEphemerallyDeployed", () => {
  let machine: Machine;

  beforeEach(() => {
    machine = machineFactory({
      system_id: "abc123",
      status_code: NodeStatusCode.DEPLOYED,
    });
  });

  it("returns true if a machine is deployed ephemerally", () => {
    machine.ephemeral_deploy = true;

    expect(isEphemerallyDeployed(machine)).toBe(true);
  });

  it("returns false if a machine is not deployed ephemerally", () => {
    machine.ephemeral_deploy = false;

    expect(isEphemerallyDeployed(machine)).toBe(false);
  });
});

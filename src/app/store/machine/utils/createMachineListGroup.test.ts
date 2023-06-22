import { FetchGroupByKey } from "../types/actions";

import { createMachineListGroup } from "./createMachineListGroup";

import { PowerState } from "app/store/types/enum";
import {
  FetchNodeStatus,
  NodeStatus,
  NodeStatusCode,
} from "app/store/types/node";
import {
  machine as machineFactory,
  modelRef as modelRefFactory,
} from "testing/factories";

describe("createMachineListGroup", () => {
  it("creates a group from architecture", () => {
    const architecture = "arm64/generic";
    const groupBy = FetchGroupByKey.Architecture;
    const machine = machineFactory({
      architecture,
    });

    expect(
      createMachineListGroup({
        groupBy,
        machine,
      })
    ).toStrictEqual({
      name: architecture,
      value: architecture,
    });
  });

  it("creates a group from power state", () => {
    const groupBy = FetchGroupByKey.PowerState;
    const machine = machineFactory({
      power_state: PowerState.ON,
    });

    expect(
      createMachineListGroup({
        groupBy,
        machine,
      })
    ).toStrictEqual({
      name: "On",
      value: PowerState.ON,
    });
  });

  it("creates a group from domain", () => {
    const groupBy = FetchGroupByKey.Domain;
    const machine = machineFactory({
      domain: modelRefFactory({ name: "maas", id: 1 }),
    });

    expect(
      createMachineListGroup({
        groupBy,
        machine,
      })
    ).toStrictEqual({
      name: "maas",
      value: "maas",
    });
  });

  it("creates a group from KVM", () => {
    const groupBy = FetchGroupByKey.Pod;
    const machine = machineFactory({
      pod: modelRefFactory({ name: "active-orca", id: 1 }),
    });

    expect(
      createMachineListGroup({
        groupBy,
        machine,
      })
    ).toStrictEqual({
      name: "active-orca",
      value: "active-orca",
    });
  });

  it("creates a group from KVM type", () => {
    const groupBy = FetchGroupByKey.PodType;
    const machine = machineFactory({
      power_type: "lxd",
    });

    expect(
      createMachineListGroup({
        groupBy,
        machine,
      })
    ).toStrictEqual({
      name: "lxd",
      value: "lxd",
    });
  });

  it("creates a group from parent", () => {
    const groupBy = FetchGroupByKey.Parent;
    const machine = machineFactory({
      parent: "abc123",
    });

    expect(
      createMachineListGroup({
        groupBy,
        machine,
      })
    ).toStrictEqual({
      name: "abc123",
      value: "abc123",
    });
  });

  it("creates a group from zone", () => {
    const groupBy = FetchGroupByKey.Zone;
    const machine = machineFactory({
      zone: modelRefFactory({ name: "maas-zone", id: 1 }),
    });

    expect(
      createMachineListGroup({
        groupBy,
        machine,
      })
    ).toStrictEqual({
      name: "maas-zone",
      value: "maas-zone",
    });
  });

  it("creates a group from status", () => {
    Object.entries(NodeStatus).forEach(([key, value]) => {
      const nodeStatusKey = key as keyof typeof NodeStatus;

      expect(
        createMachineListGroup({
          groupBy: FetchGroupByKey.Status,
          machine: machineFactory({
            status: NodeStatus[nodeStatusKey],
            status_code: NodeStatusCode[nodeStatusKey],
          }),
        })
      ).toStrictEqual({
        name: value,
        value: FetchNodeStatus[nodeStatusKey],
      });
    });
  });
});

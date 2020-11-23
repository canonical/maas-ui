import { getStatusText } from "./getStatusText";

import { nodeStatus } from "app/base/enum";
import { NodeStatus } from "app/store/types/node";
import { machine as machineFactory } from "testing/factories";

describe("getStatusText", () => {
  it("displays the machine's status if not deploying or deployed", () => {
    const machine = machineFactory({
      status: NodeStatus.NEW,
      status_code: nodeStatus.NEW,
    });
    expect(getStatusText(machine, "Ubuntu 18.04 LTS")).toEqual("New");
  });

  it("displays the release name if machine is deployed", () => {
    const machine = machineFactory({ status_code: nodeStatus.DEPLOYED });

    expect(getStatusText(machine, "Ubuntu 18.04 LTS")).toEqual(
      "Ubuntu 18.04 LTS"
    );
  });

  it("displays 'Deploying OS release' if machine is deploying", () => {
    const machine = machineFactory({ status_code: nodeStatus.DEPLOYING });

    expect(getStatusText(machine, "Ubuntu 18.04 LTS")).toEqual(
      "Deploying Ubuntu 18.04 LTS"
    );
  });
});

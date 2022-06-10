import PXEColumn from "./PXEColumn";

import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

describe("PXEColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        loaded: true,
        statuses: {
          abc123: machineStatusFactory(),
        },
      }),
    });
  });

  it("can display a boot icon", () => {
    const nic = machineInterfaceFactory({
      is_boot: true,
      type: NetworkInterfaceTypes.PHYSICAL,
    });
    const machine = machineDetailsFactory({
      interfaces: [nic],
      system_id: "abc123",
    });
    state.machine.items = [machine];
    renderWithMockStore(<PXEColumn nic={nic} node={machine} />, { state });
    // eslint-disable-next-line testing-library/no-node-access
    expect(document.querySelector(".p-icon--tick")).toBeInTheDocument();
  });

  it("does not display an icon if it is not a boot interface", () => {
    const nic = machineInterfaceFactory({
      is_boot: false,
      type: NetworkInterfaceTypes.PHYSICAL,
    });
    const machine = machineDetailsFactory({
      interfaces: [nic],
      system_id: "abc123",
    });
    state.machine.items = [machine];
    renderWithMockStore(<PXEColumn nic={nic} node={machine} />, { state });
    // eslint-disable-next-line testing-library/no-node-access
    expect(document.querySelector(".p-icon--tick")).not.toBeInTheDocument();
  });
});

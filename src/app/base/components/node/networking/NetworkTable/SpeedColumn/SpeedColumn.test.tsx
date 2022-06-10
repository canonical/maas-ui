import SpeedColumn from "./SpeedColumn";

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

describe("SpeedColumn", () => {
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

  it("can display a disconnected icon in the speed column", () => {
    const nic = machineInterfaceFactory({
      link_connected: false,
      type: NetworkInterfaceTypes.PHYSICAL,
    });
    const machine = machineDetailsFactory({
      interfaces: [nic],
      system_id: "abc123",
    });
    state.machine.items = [machine];
    renderWithMockStore(<SpeedColumn nic={nic} node={machine} />, { state });
    // eslint-disable-next-line testing-library/no-node-access
    expect(document.querySelector(".p-icon--disconnected")).toBeInTheDocument();
  });

  it("can display a slow icon in the speed column", () => {
    const nic = machineInterfaceFactory({
      interface_speed: 2,
      link_speed: 1,
      link_connected: true,
      type: NetworkInterfaceTypes.PHYSICAL,
    });
    const machine = machineDetailsFactory({
      interfaces: [nic],
      system_id: "abc123",
    });
    state.machine.items = [machine];
    renderWithMockStore(<SpeedColumn nic={nic} node={machine} />, { state });
    // eslint-disable-next-line testing-library/no-node-access
    expect(document.querySelector(".p-icon--warning")).toBeInTheDocument();
  });

  it("can display no icon in the speed column", () => {
    const nic = machineInterfaceFactory({
      link_connected: true,
      type: NetworkInterfaceTypes.PHYSICAL,
    });
    const machine = machineDetailsFactory({
      interfaces: [nic],
      system_id: "abc123",
    });
    state.machine.items = [machine];
    renderWithMockStore(<SpeedColumn nic={nic} node={machine} />, { state });
    // eslint-disable-next-line testing-library/no-node-access
    expect(
      document.querySelector("[class^='p-icon--']")
    ).not.toBeInTheDocument();
  });
});

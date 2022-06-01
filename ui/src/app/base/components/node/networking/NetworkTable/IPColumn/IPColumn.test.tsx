import { screen } from "@testing-library/react";

import IPColumn from "./IPColumn";

import { HardwareType } from "app/base/enum";
import type { RootState } from "app/store/root/types";
import {
  ScriptResultStatus,
  ScriptResultType,
} from "app/store/scriptresult/types";
import { NetworkLinkMode } from "app/store/types/enum";
import type { VLAN } from "app/store/vlan/types";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  networkDiscoveredIP as networkDiscoveredIPFactory,
  networkLink as networkLinkFactory,
  nodeScriptResultState as nodeScriptResultStateFactory,
  rootState as rootStateFactory,
  scriptResult as scriptResultFactory,
  scriptResultState as scriptResultStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

describe("IPColumn", () => {
  let state: RootState;
  let vlan: VLAN;

  beforeEach(() => {
    const fabric = fabricFactory({ name: "fabric-name" });
    vlan = vlanFactory({ fabric: fabric.id, vid: 2, name: "vlan-name" });
    state = rootStateFactory({
      fabric: fabricStateFactory({
        items: [fabric],
      }),
      vlan: vlanStateFactory({
        items: [vlan],
      }),
    });
  });

  it("can display a discovered ip address", () => {
    const discovered = networkDiscoveredIPFactory({ ip_address: "1.2.3.99" });
    const links = [networkLinkFactory()];
    const nic = machineInterfaceFactory({
      discovered: [discovered],
      links,
      vlan_id: vlan.id,
    });
    const machine = machineDetailsFactory({
      interfaces: [nic],
      system_id: "abc123",
    });
    state.machine.items = [machine];
    renderWithMockStore(<IPColumn link={links[0]} nic={nic} node={machine} />, {
      state,
    });
    expect(screen.getByText(discovered.ip_address)).toBeInTheDocument();
  });

  it("can display an ip address from a link", () => {
    const ip = "1.2.3.99";
    const link = networkLinkFactory({
      ip_address: ip,
    });
    const nic = machineInterfaceFactory({
      discovered: [],
      links: [link],
      vlan_id: vlan.id,
    });
    const machine = machineDetailsFactory({
      interfaces: [nic],
      system_id: "abc123",
    });
    state.machine.items = [machine];
    renderWithMockStore(<IPColumn link={link} nic={nic} node={machine} />, {
      state,
    });
    expect(screen.getByText(ip)).toBeInTheDocument();
  });

  it("displays as unconfigured when there is no link", () => {
    const nic = machineInterfaceFactory({
      discovered: [],
      links: [],
      vlan_id: vlan.id,
    });
    const machine = machineDetailsFactory({
      interfaces: [nic],
      system_id: "abc123",
    });
    state.machine.items = [machine];
    renderWithMockStore(<IPColumn nic={nic} node={machine} />, { state });
    expect(screen.getByText("Unconfigured")).toBeInTheDocument();
  });

  it("can display the link mode", () => {
    const links = [
      networkLinkFactory({
        mode: NetworkLinkMode.AUTO,
      }),
    ];
    const nic = machineInterfaceFactory({
      discovered: [],
      links,
      vlan_id: vlan.id,
    });
    const machine = machineDetailsFactory({
      interfaces: [nic],
      system_id: "abc123",
    });
    state.machine.items = [machine];
    renderWithMockStore(<IPColumn link={links[0]} nic={nic} node={machine} />, {
      state,
    });
    expect(screen.getByText("Auto assign")).toBeInTheDocument();
  });

  it("can display the failed network status for multiple tests", () => {
    const links = [networkLinkFactory()];
    const nic = machineInterfaceFactory({
      discovered: [],
      links,
      vlan_id: vlan.id,
    });
    const machine = machineDetailsFactory({
      interfaces: [nic],
      system_id: "abc123",
    });
    state.machine.items = [machine];
    state.scriptresult = scriptResultStateFactory({
      items: [
        scriptResultFactory({
          id: 1,
          hardware_type: HardwareType.Network,
          interface: nic,
          result_type: ScriptResultType.TESTING,
          status: ScriptResultStatus.FAILED,
        }),
        scriptResultFactory({
          id: 2,
          hardware_type: HardwareType.Network,
          interface: nic,
          result_type: ScriptResultType.TESTING,
          status: ScriptResultStatus.FAILED,
        }),
      ],
    });
    state.nodescriptresult = nodeScriptResultStateFactory({
      items: { abc123: [1, 2] },
    });
    renderWithMockStore(<IPColumn link={links[0]} nic={nic} node={machine} />, {
      state,
    });
    expect(screen.getByText("2 failed tests")).toBeInTheDocument();
  });

  it("can display the failed network status for one test", () => {
    const links = [networkLinkFactory()];
    const nic = machineInterfaceFactory({
      discovered: [],
      links,
      vlan_id: vlan.id,
    });
    const machine = machineDetailsFactory({
      interfaces: [nic],
      system_id: "abc123",
    });
    state.machine.items = [machine];
    state.scriptresult = scriptResultStateFactory({
      items: [
        scriptResultFactory({
          id: 1,
          hardware_type: HardwareType.Network,
          interface: nic,
          name: "nic test",
          result_type: ScriptResultType.TESTING,
          status: ScriptResultStatus.FAILED,
        }),
      ],
    });
    state.nodescriptresult = nodeScriptResultStateFactory({
      items: { abc123: [1, 2] },
    });
    renderWithMockStore(<IPColumn link={links[0]} nic={nic} node={machine} />, {
      state,
    });
    expect(screen.getByText("nic test failed")).toBeInTheDocument();
  });

  it("can not display the failed network status", () => {
    const nic = machineInterfaceFactory({
      discovered: [],
      links: [networkLinkFactory()],
      vlan_id: vlan.id,
    });
    const machine = machineDetailsFactory({
      interfaces: [],
      system_id: "abc123",
    });
    state.machine.items = [machine];
    renderWithMockStore(<IPColumn nic={nic} node={machine} />, { state });
    expect(screen.queryByText("failed")).not.toBeInTheDocument();
  });
});

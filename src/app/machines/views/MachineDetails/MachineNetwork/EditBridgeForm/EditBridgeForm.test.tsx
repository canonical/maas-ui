import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import configureStore from "redux-mock-store";

import EditBridgeForm from "./EditBridgeForm";

import type { RootState } from "app/store/root/types";
import {
  BridgeType,
  NetworkInterfaceTypes,
  NetworkLinkMode,
} from "app/store/types/enum";
import type { NetworkInterface, NetworkLink } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  networkLink as networkLinkFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { render, screen, submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("EditBridgeForm", () => {
  let nic: NetworkInterface;
  let link: NetworkLink;
  let state: RootState;
  beforeEach(() => {
    link = networkLinkFactory({});
    nic = machineInterfaceFactory({
      links: [link],
      type: NetworkInterfaceTypes.PHYSICAL,
    });
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            interfaces: [nic],
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
  });

  it("fetches the necessary data on load", async () => {
    const store = mockStore(state);
    render(
      <EditBridgeForm
        close={jest.fn()}
        link={link}
        nic={nic}
        systemId="abc123"
      />,
      { store }
    );
    expect(
      store.getActions().some((action) => action.type === "vlan/fetch")
    ).toBe(true);
  });

  it("displays a spinner when data is loading", async () => {
    state.vlan.loaded = false;
    const store = mockStore(state);
    render(
      <EditBridgeForm
        close={jest.fn()}
        link={link}
        nic={nic}
        systemId="abc123"
      />,
      { store }
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("can dispatch an action to update a bridge", async () => {
    state.machine.selectedMachines = { items: ["abc123", "def456"] };
    const store = mockStore(state);
    render(
      <EditBridgeForm
        close={jest.fn()}
        link={link}
        nic={nic}
        systemId="abc123"
      />,
      { store }
    );

    act(() =>
      submitFormikForm(screen.getByTestId("form"), {
        bridge_fd: 15,
        bridge_stp: false,
        bridge_type: BridgeType.OVS,
        fabric: 1,
        ip_address: "1.2.3.4",
        mac_address: "28:21:c6:b9:1b:22",
        mode: NetworkLinkMode.LINK_UP,
        name: "br1",
        subnet: 1,
        tags: ["a", "tag"],
        vlan: 1,
      })
    );

    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/updateInterface")
    ).toStrictEqual({
      type: "machine/updateInterface",
      meta: {
        model: "machine",
        method: "update_interface",
      },
      payload: {
        params: {
          bridge_fd: 15,
          bridge_stp: false,
          bridge_type: BridgeType.OVS,
          fabric: 1,
          interface_id: nic.id,
          ip_address: "1.2.3.4",
          link_id: link.id,
          mac_address: "28:21:c6:b9:1b:22",
          mode: NetworkLinkMode.LINK_UP,
          name: "br1",
          subnet: 1,
          system_id: "abc123",
          tags: ["a", "tag"],
          vlan: 1,
        },
      },
    });
  });
});

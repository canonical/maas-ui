import configureStore from "redux-mock-store";

import NetworkTableActions from "./NetworkTableActions";

import { ExpandedState } from "app/base/components/NodeNetworkTab/NodeNetworkTab";
import type { MachineDetails } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes, NetworkLinkMode } from "app/store/types/enum";
import type { NetworkInterface } from "app/store/types/node";
import { NodeStatus } from "app/store/types/node";
import {
  fabric as fabricFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineInterface as machineInterfaceFactory,
  networkLink as networkLinkFactory,
  rootState as rootStateFactory,
  vlan as vlanFactory,
} from "testing/factories";
import { renderWithMockStore, screen, userEvent } from "testing/utils";

const mockStore = configureStore<RootState>();

const openMenu = async () => {
  await userEvent.click(screen.getByRole("button", { name: "Take action:" }));
};

describe("NetworkTableActions", () => {
  let nic: NetworkInterface;
  let state: RootState;
  beforeEach(() => {
    nic = machineInterfaceFactory();
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            interfaces: [nic],
            system_id: "abc123",
          }),
        ] as MachineDetails[],
        loaded: true,
      }),
    });
  });

  it("can display the menu", () => {
    const store = mockStore(state);
    renderWithMockStore(
      <NetworkTableActions
        nic={nic}
        setExpanded={jest.fn()}
        systemId="abc123"
      />,
      { store }
    );
    expect(
      screen.getByRole("button", { name: "Take action:" })
    ).toBeInTheDocument();
  });

  it("disables menu when networking is disabled and limited editing is not allowed", () => {
    state.machine.items[0].permissions = [];
    state.machine.items[0].status = NodeStatus.NEW;
    nic.type = NetworkInterfaceTypes.VLAN;
    const store = mockStore(state);
    renderWithMockStore(
      <NetworkTableActions
        nic={nic}
        setExpanded={jest.fn()}
        systemId="abc123"
      />,
      { store }
    );
    expect(screen.getByRole("button", { name: "Take action:" })).toBeDisabled();
  });

  it("can display an item to mark an interface as connected", async () => {
    nic.type = NetworkInterfaceTypes.PHYSICAL;
    nic.link_connected = false;
    const store = mockStore(state);
    renderWithMockStore(
      <NetworkTableActions
        nic={nic}
        setExpanded={jest.fn()}
        systemId="abc123"
      />,
      { store }
    );
    // Open the menu:
    await openMenu();

    expect(
      screen.getByRole("button", { name: "Mark as connected" })
    ).toBeInTheDocument();
  });

  it("can display an item to mark an interface as disconnected", async () => {
    nic.type = NetworkInterfaceTypes.PHYSICAL;
    nic.link_connected = true;
    const store = mockStore(state);
    renderWithMockStore(
      <NetworkTableActions
        nic={nic}
        setExpanded={jest.fn()}
        systemId="abc123"
      />,
      { store }
    );
    // Open the menu:
    await openMenu();

    expect(
      screen.getByRole("button", { name: "Mark as disconnected" })
    ).toBeInTheDocument();
  });

  it("does not display an item to mark an alias as connected", async () => {
    nic.type = NetworkInterfaceTypes.PHYSICAL;
    nic.link_connected = false;
    const link = networkLinkFactory();
    nic.links = [networkLinkFactory(), link];
    const store = mockStore(state);
    renderWithMockStore(
      <NetworkTableActions
        link={link}
        nic={nic}
        setExpanded={jest.fn()}
        systemId="abc123"
      />,
      { store }
    );
    // Open the menu:
    await openMenu();
    expect(
      screen.queryByRole("button", { name: "Mark as connected" })
    ).not.toBeInTheDocument();
  });

  it("does not display an item to mark an alias as disconnected", async () => {
    nic.type = NetworkInterfaceTypes.PHYSICAL;
    nic.link_connected = true;
    const link = networkLinkFactory();
    nic.links = [networkLinkFactory(), link];
    const store = mockStore(state);
    renderWithMockStore(
      <NetworkTableActions
        link={link}
        nic={nic}
        setExpanded={jest.fn()}
        systemId="abc123"
      />,
      { store }
    );
    // Open the menu:
    await openMenu();
    expect(
      screen.queryByRole("button", { name: "Mark as disconnected" })
    ).not.toBeInTheDocument();
  });

  it("can display an item to remove the interface", async () => {
    nic.type = NetworkInterfaceTypes.BOND;
    const store = mockStore(state);
    renderWithMockStore(
      <NetworkTableActions
        nic={nic}
        setExpanded={jest.fn()}
        systemId="abc123"
      />,
      { store }
    );
    // Open the menu:
    await openMenu();
    expect(
      screen.getByRole("button", { name: "Remove Bond..." })
    ).toBeInTheDocument();
  });

  it("can display an item to edit the interface", async () => {
    nic.type = NetworkInterfaceTypes.BOND;
    const setExpanded = jest.fn();
    const store = mockStore(state);
    renderWithMockStore(
      <NetworkTableActions
        nic={nic}
        setExpanded={setExpanded}
        systemId="abc123"
      />,
      { store }
    );
    // Open the menu:
    await openMenu();
    const editBondButton = screen.getByRole("button", {
      name: "Edit Bond",
    });
    expect(editBondButton).toBeInTheDocument();
    await userEvent.click(editBondButton);
    expect(setExpanded).toHaveBeenCalledWith({
      content: ExpandedState.EDIT,
      nicId: nic.id,
    });
  });

  it("can display a warning when trying to edit a disconnected interface", async () => {
    nic.type = NetworkInterfaceTypes.PHYSICAL;
    nic.link_connected = false;
    const setExpanded = jest.fn();
    const store = mockStore(state);
    renderWithMockStore(
      <NetworkTableActions
        nic={nic}
        setExpanded={setExpanded}
        systemId="abc123"
      />,
      { store }
    );
    // Open the menu:
    await openMenu();
    const editPhysicalButton = screen.getByRole("button", {
      name: "Edit Physical",
    });
    expect(editPhysicalButton).toBeInTheDocument();
    await userEvent.click(editPhysicalButton);
    expect(setExpanded).toHaveBeenCalledWith({
      content: ExpandedState.DISCONNECTED_WARNING,
      nicId: nic.id,
    });
  });

  it("can display an action to add an alias", async () => {
    nic.type = NetworkInterfaceTypes.PHYSICAL;
    nic.links = [networkLinkFactory()];
    const store = mockStore(state);
    renderWithMockStore(
      <NetworkTableActions
        nic={nic}
        setExpanded={jest.fn()}
        systemId="abc123"
      />,
      { store }
    );
    // Open the menu:
    await openMenu();
    const addAlias = screen.getByRole("button", {
      name: "Add alias",
    });
    expect(addAlias).toBeInTheDocument();
    expect(addAlias).not.toBeDisabled();
    expect(
      screen.queryByRole("tooltip", {
        name: "IP mode needs to be configured for this interface.",
      })
    ).not.toBeInTheDocument();
  });

  it("can display a disabled action to add an alias", async () => {
    nic.type = NetworkInterfaceTypes.PHYSICAL;
    nic.links = [networkLinkFactory({ mode: NetworkLinkMode.LINK_UP })];
    const store = mockStore(state);
    renderWithMockStore(
      <NetworkTableActions
        nic={nic}
        setExpanded={jest.fn()}
        systemId="abc123"
      />,
      { store }
    );
    // Open the menu:
    await openMenu();
    const addAlias = screen.getByRole("button", {
      name: "Add alias",
    });
    expect(addAlias).toBeInTheDocument();
    expect(addAlias).toBeDisabled();
    expect(
      screen.getByRole("tooltip", {
        name: "IP mode needs to be configured for this interface.",
      })
    ).toBeInTheDocument();
  });

  it("can display an action to add a VLAN", async () => {
    nic.type = NetworkInterfaceTypes.PHYSICAL;
    const fabric = fabricFactory();
    state.fabric.items = [fabric];
    const vlan = vlanFactory({ fabric: fabric.id });
    state.vlan.items = [vlan];
    nic.vlan_id = vlan.id;
    const store = mockStore(state);
    renderWithMockStore(
      <NetworkTableActions
        nic={nic}
        setExpanded={jest.fn()}
        systemId="abc123"
      />,
      { store }
    );
    // Open the menu:
    await openMenu();
    const addVLAN = screen.getByRole("button", { name: "Add VLAN" });
    expect(addVLAN).toBeInTheDocument();
    expect(addVLAN).not.toBeDisabled();
    expect(
      screen.queryByRole("tooltip", {
        name: "There are no unused VLANS for this interface.",
      })
    ).not.toBeInTheDocument();
  });

  it("can display a disabled action to add a VLAN", async () => {
    nic.type = NetworkInterfaceTypes.PHYSICAL;
    state.vlan.items = [];
    const store = mockStore(state);
    renderWithMockStore(
      <NetworkTableActions
        nic={nic}
        setExpanded={jest.fn()}
        systemId="abc123"
      />,
      { store }
    );
    // Open the menu:
    await openMenu();
    const addVLAN = screen.getByRole("button", { name: "Add VLAN" });
    expect(addVLAN).toBeInTheDocument();
    expect(addVLAN).toBeDisabled();
    expect(
      screen.getByRole("tooltip", {
        name: "There are no unused VLANS for this interface.",
      })
    ).toBeInTheDocument();
  });

  it("can not display an action to add an alias or vlan", async () => {
    state.machine.items[0].permissions = [];
    state.machine.items[0].status = NodeStatus.NEW;
    const store = mockStore(state);
    renderWithMockStore(
      <NetworkTableActions
        nic={nic}
        setExpanded={jest.fn()}
        systemId="abc123"
      />,
      { store }
    );
    // Open the menu:
    await openMenu();
    expect(
      screen.queryByRole("button", { name: "Add alias" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Add VLAN" })
    ).not.toBeInTheDocument();
  });
});

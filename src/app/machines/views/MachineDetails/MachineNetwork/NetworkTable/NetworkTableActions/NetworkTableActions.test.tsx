import NetworkTableActions from "./NetworkTableActions";

import * as sidePanelHooks from "@/app/base/side-panel-context";
import { MachineSidePanelViews } from "@/app/machines/constants";
import type { MachineDetails } from "@/app/store/machine/types";
import type { RootState } from "@/app/store/root/types";
import { NetworkInterfaceTypes, NetworkLinkMode } from "@/app/store/types/enum";
import type { NetworkInterface } from "@/app/store/types/node";
import { NodeStatus } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import {
  expectTooltipOnHover,
  renderWithMockStore,
  screen,
  userEvent,
  within,
} from "@/testing/utils";

const openMenu = async () => {
  await userEvent.click(screen.getByRole("button", { name: "Take action:" }));
};

describe("NetworkTableActions", () => {
  let nic: NetworkInterface;
  let state: RootState;
  const setSidePanelContent = vi.fn();
  beforeAll(() => {
    vi.spyOn(sidePanelHooks, "useSidePanel").mockReturnValue({
      setSidePanelContent,
      sidePanelContent: null,
      setSidePanelSize: vi.fn(),
      sidePanelSize: "regular",
    });
  });
  beforeEach(() => {
    nic = factory.machineInterface();
    state = factory.rootState({
      machine: factory.machineState({
        items: [
          factory.machineDetails({
            interfaces: [nic],
            system_id: "abc123",
          }),
        ] as MachineDetails[],
        loaded: true,
      }),
    });
  });

  it("can display the menu", () => {
    renderWithMockStore(<NetworkTableActions nic={nic} systemId="abc123" />, {
      state,
    });
    expect(
      screen.getByRole("button", { name: "Take action:" })
    ).toBeInTheDocument();
  });

  it("disables menu when networking is disabled and limited editing is not allowed", () => {
    state.machine.items[0].permissions = [];
    state.machine.items[0].status = NodeStatus.NEW;
    nic.type = NetworkInterfaceTypes.VLAN;

    renderWithMockStore(<NetworkTableActions nic={nic} systemId="abc123" />, {
      state,
    });
    expect(
      screen.getByRole("button", { name: "Take action:" })
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("can display an item to mark an interface as connected", async () => {
    nic.type = NetworkInterfaceTypes.PHYSICAL;
    nic.link_connected = false;

    renderWithMockStore(<NetworkTableActions nic={nic} systemId="abc123" />, {
      state,
    });
    // Open the menu:
    await openMenu();

    expect(
      screen.getByRole("button", { name: "Mark as connected" })
    ).toBeInTheDocument();
  });

  it("can display an item to mark an interface as disconnected", async () => {
    nic.type = NetworkInterfaceTypes.PHYSICAL;
    nic.link_connected = true;

    renderWithMockStore(<NetworkTableActions nic={nic} systemId="abc123" />, {
      state,
    });
    // Open the menu:
    await openMenu();

    expect(
      screen.getByRole("button", { name: "Mark as disconnected" })
    ).toBeInTheDocument();
  });

  it("does not display an item to mark an alias as connected", async () => {
    nic.type = NetworkInterfaceTypes.PHYSICAL;
    nic.link_connected = false;
    const link = factory.networkLink();
    nic.links = [factory.networkLink(), link];

    renderWithMockStore(
      <NetworkTableActions link={link} nic={nic} systemId="abc123" />,
      { state }
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
    const link = factory.networkLink();
    nic.links = [factory.networkLink(), link];

    renderWithMockStore(
      <NetworkTableActions link={link} nic={nic} systemId="abc123" />,
      { state }
    );
    // Open the menu:
    await openMenu();
    expect(
      screen.queryByRole("button", { name: "Mark as disconnected" })
    ).not.toBeInTheDocument();
  });

  it("can display an item to remove the interface", async () => {
    nic.type = NetworkInterfaceTypes.BOND;

    renderWithMockStore(<NetworkTableActions nic={nic} systemId="abc123" />, {
      state,
    });
    // Open the menu:
    await openMenu();
    expect(
      screen.getByRole("button", { name: "Remove Bond..." })
    ).toBeInTheDocument();
  });

  it("can display an item to edit the interface", async () => {
    nic.type = NetworkInterfaceTypes.BOND;

    renderWithMockStore(<NetworkTableActions nic={nic} systemId="abc123" />, {
      state,
    });
    // Open the menu:
    await openMenu();
    const editBondButton = screen.getByRole("button", {
      name: "Edit Bond",
    });
    expect(editBondButton).toBeInTheDocument();
    await userEvent.click(editBondButton);
    expect(setSidePanelContent).toHaveBeenCalledWith(
      expect.objectContaining({
        view: MachineSidePanelViews.EDIT_PHYSICAL,
      })
    );
  });

  it("can display a warning when trying to edit a disconnected interface", async () => {
    nic.type = NetworkInterfaceTypes.PHYSICAL;
    nic.link_connected = false;

    renderWithMockStore(<NetworkTableActions nic={nic} systemId="abc123" />, {
      state,
    });
    // Open the menu:
    await openMenu();
    const editPhysicalButton = screen.getByRole("button", {
      name: "Edit Physical",
    });
    expect(editPhysicalButton).toBeInTheDocument();
    await userEvent.click(editPhysicalButton);
    expect(setSidePanelContent).toHaveBeenCalledWith(
      expect.objectContaining({
        view: MachineSidePanelViews.MARK_CONNECTED,
      })
    );
  });

  it("can display an action to add an alias", async () => {
    nic.type = NetworkInterfaceTypes.PHYSICAL;
    nic.links = [factory.networkLink()];

    renderWithMockStore(<NetworkTableActions nic={nic} systemId="abc123" />, {
      state,
    });
    // Open the menu:
    await openMenu();
    const addAlias = screen.getByRole("button", {
      name: /Add alias/i,
    });
    expect(addAlias).toBeInTheDocument();
    expect(addAlias).not.toHaveAttribute("aria-disabled");
    await userEvent.hover(addAlias);
    expect(
      screen.queryByRole("tooltip", {
        name: "IP mode needs to be configured for this interface.",
      })
    ).not.toBeInTheDocument();
  });

  it("can display a disabled action to add an alias", async () => {
    nic.type = NetworkInterfaceTypes.PHYSICAL;
    nic.links = [factory.networkLink({ mode: NetworkLinkMode.LINK_UP })];

    renderWithMockStore(<NetworkTableActions nic={nic} systemId="abc123" />, {
      state,
    });
    // Open the menu:
    await openMenu();
    const addAlias = screen.getByRole("button", {
      name: /Add alias/i,
    });
    expect(addAlias).toBeInTheDocument();
    expect(addAlias).toHaveAttribute("aria-disabled", "true");
    await expectTooltipOnHover(
      addAlias.querySelector("i")!,
      "IP mode needs to be configured for this interface."
    );
  });

  it("can display an action to add a VLAN", async () => {
    nic.type = NetworkInterfaceTypes.PHYSICAL;
    const fabric = factory.fabric();
    state.fabric.items = [fabric];
    const vlan = factory.vlan({ fabric: fabric.id });
    state.vlan.items = [vlan];
    nic.vlan_id = vlan.id;

    renderWithMockStore(<NetworkTableActions nic={nic} systemId="abc123" />, {
      state,
    });
    // Open the menu:
    await openMenu();
    const addVLAN = screen.getByRole("button", { name: /Add VLAN/i });
    expect(addVLAN).toBeInTheDocument();
    expect(addVLAN).not.toHaveAttribute("aria-disabled");
    expect(
      screen.queryByRole("tooltip", {
        name: "There are no unused VLANS for this interface.",
      })
    ).not.toBeInTheDocument();
  });

  it("can display a disabled action to add a VLAN", async () => {
    nic.type = NetworkInterfaceTypes.PHYSICAL;
    state.vlan.items = [];

    renderWithMockStore(<NetworkTableActions nic={nic} systemId="abc123" />, {
      state,
    });
    // Open the menu:
    await openMenu();
    const addVLAN = screen.getByRole("button", { name: /Add VLAN/i });
    expect(addVLAN).toBeInTheDocument();
    expect(addVLAN).toHaveAttribute("aria-disabled", "true");
    await expectTooltipOnHover(
      addVLAN,
      "There are no unused VLANS for this interface."
    );
    await userEvent.hover(within(addVLAN).getByLabelText("help"));
    await vi.waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent(
        "There are no unused VLANS for this interface."
      );
    });
  });

  it("can not display an action to add an alias or vlan", async () => {
    state.machine.items[0].permissions = [];
    state.machine.items[0].status = NodeStatus.NEW;

    renderWithMockStore(<NetworkTableActions nic={nic} systemId="abc123" />, {
      state,
    });
    // Open the menu:
    await openMenu();
    expect(
      screen.queryByRole("button", { name: /Add alias/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Add VLAN/i })
    ).not.toBeInTheDocument();
  });
});

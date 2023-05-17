import MachineNetworkActions from "./MachineNetworkActions";

import { ExpandedState } from "app/base/components/NodeNetworkTab/NodeNetworkTab";
import { MachineHeaderViews } from "app/machines/constants";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import { NodeStatus } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  networkLink as networkLinkFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

describe("MachineNetworkActions", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  describe("validate network", () => {
    it("disables the button when networking is disabled", () => {
      state.machine.items[0].status = NodeStatus.DEPLOYED;

      renderWithBrowserRouter(
        <MachineNetworkActions
          expanded={null}
          selected={[]}
          setExpanded={jest.fn()}
          setSidePanelContent={jest.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );
      // expect(wrapper.find("Button").last().prop("disabled")).toBe(true);
      expect(
        screen.getByRole("button", { name: /Validate network configuration/i })
      ).toBeDisabled();
    });

    it("shows the test form when clicking the button", async () => {
      const setSidePanelContent = jest.fn();

      renderWithBrowserRouter(
        <MachineNetworkActions
          expanded={null}
          selected={[]}
          setExpanded={jest.fn()}
          setSidePanelContent={setSidePanelContent}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );

      await userEvent.click(
        screen.getByRole("button", { name: /Validate network configuration/i })
      );
      expect(setSidePanelContent).toHaveBeenCalledWith({
        view: MachineHeaderViews.TEST_MACHINE,
        extras: { applyConfiguredNetworking: true },
      });
    });
  });

  describe("create bond", () => {
    it("sets the state to show the form when clicking the button", async () => {
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              id: 1,
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 1,
            }),
            machineInterfaceFactory({
              id: 2,
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 1,
            }),
          ],
          system_id: "abc123",
        }),
      ];
      const setExpanded = jest.fn();

      renderWithBrowserRouter(
        <MachineNetworkActions
          expanded={null}
          selected={[{ nicId: 1 }, { nicId: 2 }]}
          setExpanded={setExpanded}
          setSidePanelContent={jest.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );

      await userEvent.click(
        screen.getByRole("button", { name: /Create bond/i })
      );

      expect(setExpanded).toHaveBeenCalledWith({
        content: ExpandedState.ADD_BOND,
      });
    });

    it("disables the button when networking is disabled", () => {
      state.machine.items[0].status = NodeStatus.DEPLOYED;

      renderWithBrowserRouter(
        <MachineNetworkActions
          expanded={null}
          selected={[]}
          setExpanded={jest.fn()}
          setSidePanelContent={jest.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );
      expect(
        screen.getByRole("button", { name: /Create bond/i })
      ).toBeDisabled();
    });

    it("disables the button when no interfaces are selected", () => {
      renderWithBrowserRouter(
        <MachineNetworkActions
          expanded={null}
          selected={[]}
          setExpanded={jest.fn()}
          setSidePanelContent={jest.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );

      expect(
        screen.getByRole("button", { name: /Create bond/i })
      ).toBeDisabled();
      screen
        .getAllByRole("tooltip", { name: /no interfaces are selected/i })
        .forEach((tooltip) => expect(tooltip).toBeInTheDocument());
    });

    it("disables the create bond button when only 1 interface is selected", () => {
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              id: 1,
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
            machineInterfaceFactory({
              id: 2,
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
          ],
          system_id: "abc123",
        }),
      ];

      renderWithBrowserRouter(
        <MachineNetworkActions
          expanded={null}
          selected={[{ nicId: 1 }]}
          setExpanded={jest.fn()}
          setSidePanelContent={jest.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );

      expect(
        screen.getByRole("button", { name: /Create bond/i })
      ).toBeDisabled();
      expect(
        screen.getByRole("tooltip", {
          name: /A bond must include more than one interface/i,
        })
      ).toBeInTheDocument();
    });

    it("disables the button when some selected interfaces are not physical", () => {
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              id: 1,
              links: [
                networkLinkFactory({ id: 1 }),
                networkLinkFactory({ id: 2 }),
              ],
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 1,
            }),
            machineInterfaceFactory({
              id: 2,
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 1,
            }),
          ],
          system_id: "abc123",
        }),
      ];

      renderWithBrowserRouter(
        <MachineNetworkActions
          expanded={null}
          selected={[{ nicId: 1, linkId: 2 }, { nicId: 2 }]}
          setExpanded={jest.fn()}
          setSidePanelContent={jest.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );

      expect(
        screen.getByRole("button", { name: /Create bond/i })
      ).toBeDisabled();
      expect(
        screen.getByRole("tooltip", {
          name: /A bond can only include physical interfaces/i,
        })
      ).toBeInTheDocument();
    });

    it("disables the button when selected interfaces have different VLANS", () => {
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              id: 1,
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 1,
            }),
            machineInterfaceFactory({
              id: 2,
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 2,
            }),
          ],
          system_id: "abc123",
        }),
      ];

      renderWithBrowserRouter(
        <MachineNetworkActions
          expanded={null}
          selected={[{ nicId: 1, linkId: 2 }, { nicId: 2 }]}
          setExpanded={jest.fn()}
          setSidePanelContent={jest.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );

      expect(
        screen.getByRole("button", { name: /Create bond/i })
      ).toBeDisabled();
      expect(
        screen.getByRole("tooltip", {
          name: /All selected interfaces must be on the same VLAN/i,
        })
      ).toBeInTheDocument();
    });
  });

  describe("create bridge", () => {
    it("sets the state to show the form when clicking the button", async () => {
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              id: 1,
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
          ],
          system_id: "abc123",
        }),
      ];
      const setExpanded = jest.fn();

      renderWithBrowserRouter(
        <MachineNetworkActions
          expanded={null}
          selected={[{ nicId: 1 }]}
          setExpanded={setExpanded}
          setSidePanelContent={jest.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );

      await userEvent.click(
        screen.getByRole("button", { name: /create bridge/i })
      );
      expect(setExpanded).toHaveBeenCalledWith({
        content: ExpandedState.ADD_BRIDGE,
      });
    });

    it("disables the button when networking is disabled", () => {
      state.machine.items[0].status = NodeStatus.DEPLOYED;

      renderWithBrowserRouter(
        <MachineNetworkActions
          expanded={null}
          selected={[]}
          setExpanded={jest.fn()}
          setSidePanelContent={jest.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );
      expect(
        screen.getByRole("button", { name: /create bridge/i })
      ).toBeDisabled();
      screen
        .getAllByRole("tooltip", {
          name: new RegExp("Network can't be modified for this machine.", "i"),
        })
        .forEach((tooltip) => expect(tooltip).toBeInTheDocument());
    });

    it("disables the button when no interfaces are selected", () => {
      renderWithBrowserRouter(
        <MachineNetworkActions
          expanded={null}
          selected={[]}
          setExpanded={jest.fn()}
          setSidePanelContent={jest.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );

      expect(
        screen.getByRole("button", { name: /create bridge/i })
      ).toBeDisabled();
    });

    it("disables the button when more than 1 interface is selected", () => {
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              id: 1,
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
            machineInterfaceFactory({
              id: 2,
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
          ],
          system_id: "abc123",
        }),
      ];

      renderWithBrowserRouter(
        <MachineNetworkActions
          expanded={null}
          selected={[{ nicId: 1 }, { nicId: 2 }]}
          setExpanded={jest.fn()}
          setSidePanelContent={jest.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );

      expect(
        screen.getByRole("button", { name: /create bridge/i })
      ).toBeDisabled();
      expect(
        screen.getByRole("tooltip", {
          name: /A bridge can only be created from one interface/i,
        })
      ).toBeInTheDocument();
    });

    it("disables the button when an alias is selected", () => {
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              id: 1,
              links: [
                networkLinkFactory({ id: 1 }),
                networkLinkFactory({ id: 2 }),
              ],
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 1,
            }),
            machineInterfaceFactory({
              id: 2,
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 1,
            }),
          ],
          system_id: "abc123",
        }),
      ];

      renderWithBrowserRouter(
        <MachineNetworkActions
          expanded={null}
          selected={[{ nicId: 1, linkId: 2 }]}
          setExpanded={jest.fn()}
          setSidePanelContent={jest.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );

      expect(
        screen.getByRole("button", { name: /create bridge/i })
      ).toBeDisabled();
      expect(
        screen.getByRole("tooltip", {
          name: /A bridge can not be created from an alias/i,
        })
      ).toBeInTheDocument();
    });

    it("disables the button when a bridge is selected", () => {
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              id: 1,
              type: NetworkInterfaceTypes.BRIDGE,
            }),
            machineInterfaceFactory({
              id: 2,
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
          ],
          system_id: "abc123",
        }),
      ];

      renderWithBrowserRouter(
        <MachineNetworkActions
          expanded={null}
          selected={[{ nicId: 1 }, { nicId: 2 }]}
          setExpanded={jest.fn()}
          setSidePanelContent={jest.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );

      expect(
        screen.getByRole("button", { name: /create bridge/i })
      ).toBeDisabled();
      expect(
        screen.getByRole("tooltip", {
          name: /A bridge can only be created from one interface/i,
        })
      ).toBeInTheDocument();
    });
  });
});

import MachineNetworkActions from "./MachineNetworkActions";

import { ExpandedState } from "@/app/base/components/NodeNetworkTab/NodeNetworkTab";
import { MachineSidePanelViews } from "@/app/machines/constants";
import type { RootState } from "@/app/store/root/types";
import { NetworkInterfaceTypes } from "@/app/store/types/enum";
import { NodeStatus } from "@/app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  networkLink as networkLinkFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

const expectDisabledButtonWithTooltip = async (
  buttonLabel: string | RegExp,
  tooltipLabel: string | RegExp
) => {
  const button = screen.getByRole("button", {
    name: buttonLabel,
  });
  expect(button).toBeDisabled();
  await userEvent.hover(button);
  expect(
    screen.getByRole("tooltip", {
      name: tooltipLabel,
    })
  ).toBeInTheDocument();
};

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
          setExpanded={vi.fn()}
          setSidePanelContent={vi.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );

      expect(
        screen.getByRole("button", { name: /Validate network configuration/i })
      ).toBeDisabled();
    });

    it("shows the test form when clicking the button", async () => {
      const setSidePanelContent = vi.fn();

      renderWithBrowserRouter(
        <MachineNetworkActions
          expanded={null}
          selected={[]}
          setExpanded={vi.fn()}
          setSidePanelContent={setSidePanelContent}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );

      await userEvent.click(
        screen.getByRole("button", { name: /Validate network configuration/i })
      );
      expect(setSidePanelContent).toHaveBeenCalledWith({
        view: MachineSidePanelViews.TEST_MACHINE,
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
      const setExpanded = vi.fn();

      renderWithBrowserRouter(
        <MachineNetworkActions
          expanded={null}
          selected={[{ nicId: 1 }, { nicId: 2 }]}
          setExpanded={setExpanded}
          setSidePanelContent={vi.fn()}
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
          setExpanded={vi.fn()}
          setSidePanelContent={vi.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );
      expect(
        screen.getByRole("button", { name: /Create bond/i })
      ).toBeDisabled();
    });

    it("disables the button when no interfaces are selected", async () => {
      renderWithBrowserRouter(
        <MachineNetworkActions
          expanded={null}
          selected={[]}
          setExpanded={vi.fn()}
          setSidePanelContent={vi.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );
      await expectDisabledButtonWithTooltip(
        /Create bond/i,
        /no interfaces are selected/i
      );
    });

    it("disables the create bond button when only 1 interface is selected", async () => {
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
          setExpanded={vi.fn()}
          setSidePanelContent={vi.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );

      await expectDisabledButtonWithTooltip(
        /Create bond/i,
        /A bond must include more than one interface/i
      );
    });

    it("disables the button when some selected interfaces are not physical", async () => {
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
          setExpanded={vi.fn()}
          setSidePanelContent={vi.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );
      await expectDisabledButtonWithTooltip(
        /Create bond/i,
        /A bond can only include physical interfaces/i
      );
    });

    it("disables the button when selected interfaces have different VLANS", async () => {
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
          setExpanded={vi.fn()}
          setSidePanelContent={vi.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );

      await expectDisabledButtonWithTooltip(
        /Create bond/i,
        /All selected interfaces must be on the same VLAN/i
      );
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
      const setExpanded = vi.fn();

      renderWithBrowserRouter(
        <MachineNetworkActions
          expanded={null}
          selected={[{ nicId: 1 }]}
          setExpanded={setExpanded}
          setSidePanelContent={vi.fn()}
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

    it("disables the button when networking is disabled", async () => {
      state.machine.items[0].status = NodeStatus.DEPLOYED;

      renderWithBrowserRouter(
        <MachineNetworkActions
          expanded={null}
          selected={[]}
          setExpanded={vi.fn()}
          setSidePanelContent={vi.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );

      await expectDisabledButtonWithTooltip(
        /Create bond/i,
        /Network can't be modified for this machine./i
      );
    });

    it("disables the button when no interfaces are selected", () => {
      renderWithBrowserRouter(
        <MachineNetworkActions
          expanded={null}
          selected={[]}
          setExpanded={vi.fn()}
          setSidePanelContent={vi.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );

      expect(
        screen.getByRole("button", { name: /create bridge/i })
      ).toBeDisabled();
    });

    it("disables the button when more than 1 interface is selected", async () => {
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
          setExpanded={vi.fn()}
          setSidePanelContent={vi.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );

      await expectDisabledButtonWithTooltip(
        /create bridge/i,
        /A bridge can only be created from one interface/i
      );
    });

    it("disables the button when an alias is selected", async () => {
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
          setExpanded={vi.fn()}
          setSidePanelContent={vi.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );

      await expectDisabledButtonWithTooltip(
        /create bridge/i,
        /A bridge can not be created from an alias/i
      );
    });

    it("disables the button when a bridge is selected", async () => {
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
          setExpanded={vi.fn()}
          setSidePanelContent={vi.fn()}
          systemId="abc123"
        />,
        { state, route: "/machine/abc123" }
      );

      await expectDisabledButtonWithTooltip(
        /create bridge/i,
        /A bridge can only be created from one interface/i
      );
    });
  });
});

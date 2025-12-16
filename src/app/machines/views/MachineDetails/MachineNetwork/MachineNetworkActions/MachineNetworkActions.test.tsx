import MachineNetworkActions from "./MachineNetworkActions";

import * as sidePanelHooks from "@/app/base/side-panel-context";
import { MachineSidePanelViews } from "@/app/machines/constants";
import type { RootState } from "@/app/store/root/types";
import { NetworkInterfaceTypes } from "@/app/store/types/enum";
import { NodeStatus } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import {
  expectTooltipOnHover,
  renderWithProviders,
  screen,
  userEvent,
} from "@/testing/utils";

const expectDisabledButtonWithTooltip = async (
  buttonLabel: RegExp | string,
  tooltipLabel: RegExp | string
) => {
  const button = screen.getByRole("button", {
    name: buttonLabel,
  });
  expect(button).toBeAriaDisabled();
  await expectTooltipOnHover(button, tooltipLabel);
};

describe("MachineNetworkActions", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      machine: factory.machineState({
        items: [
          factory.machineDetails({
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  describe("validate network", () => {
    it("disables the button when networking is disabled", () => {
      state.machine.items[0].status = NodeStatus.DEPLOYED;

      renderWithProviders(
        <MachineNetworkActions
          expanded={null}
          selected={[]}
          setSelected={vi.fn()}
          systemId="abc123"
        />,
        { state, initialEntries: ["/machine/abc123"] }
      );

      expect(
        screen.getByRole("button", { name: /Validate network configuration/i })
      ).toBeAriaDisabled();
    });

    it("shows the test form when clicking the button", async () => {
      const setSidePanelContent = vi.fn();

      renderWithProviders(
        <MachineNetworkActions
          expanded={null}
          selected={[]}
          setSelected={vi.fn()}
          systemId="abc123"
        />,
        { state, initialEntries: ["/machine/abc123"] }
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
        factory.machineDetails({
          interfaces: [
            factory.machineInterface({
              id: 1,
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 1,
            }),
            factory.machineInterface({
              id: 2,
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 1,
            }),
          ],
          system_id: "abc123",
        }),
      ];
      const setSidePanelContent = vi.fn();
      vi.spyOn(sidePanelHooks, "useSidePanel").mockReturnValue({
        setSidePanelContent,
        sidePanelContent: null,
        setSidePanelSize: vi.fn(),
        sidePanelSize: "regular",
      });

      renderWithProviders(
        <MachineNetworkActions
          expanded={null}
          selected={[{ nicId: 1 }, { nicId: 2 }]}
          setSelected={vi.fn()}
          systemId="abc123"
        />,
        { state, initialEntries: ["/machine/abc123"] }
      );

      await userEvent.click(
        screen.getByRole("button", { name: /Create bond/i })
      );

      expect(setSidePanelContent).toHaveBeenCalledWith(
        expect.objectContaining({
          view: MachineSidePanelViews.ADD_BOND,
        })
      );
    });

    it("disables the button when networking is disabled", () => {
      state.machine.items[0].status = NodeStatus.DEPLOYED;

      renderWithProviders(
        <MachineNetworkActions
          expanded={null}
          selected={[]}
          setSelected={vi.fn()}
          systemId="abc123"
        />,
        { state, initialEntries: ["/machine/abc123"] }
      );
      expect(
        screen.getByRole("button", { name: /Create bond/i })
      ).toBeAriaDisabled();
    });

    it("disables the button when no interfaces are selected", async () => {
      renderWithProviders(
        <MachineNetworkActions
          expanded={null}
          selected={[]}
          setSelected={vi.fn()}
          systemId="abc123"
        />,
        { state, initialEntries: ["/machine/abc123"] }
      );
      await expectDisabledButtonWithTooltip(
        /Create bond/i,
        /no interfaces are selected/i
      );
    });

    it("disables the create bond button when only 1 interface is selected", async () => {
      state.machine.items = [
        factory.machineDetails({
          interfaces: [
            factory.machineInterface({
              id: 1,
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
            factory.machineInterface({
              id: 2,
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
          ],
          system_id: "abc123",
        }),
      ];

      renderWithProviders(
        <MachineNetworkActions
          expanded={null}
          selected={[{ nicId: 1 }]}
          setSelected={vi.fn()}
          systemId="abc123"
        />,
        { state, initialEntries: ["/machine/abc123"] }
      );

      await expectDisabledButtonWithTooltip(
        /Create bond/i,
        /A bond must include more than one interface/i
      );
    });

    it("disables the button when some selected interfaces are not physical", async () => {
      state.machine.items = [
        factory.machineDetails({
          interfaces: [
            factory.machineInterface({
              id: 1,
              links: [
                factory.networkLink({ id: 1 }),
                factory.networkLink({ id: 2 }),
              ],
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 1,
            }),
            factory.machineInterface({
              id: 2,
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 1,
            }),
          ],
          system_id: "abc123",
        }),
      ];

      renderWithProviders(
        <MachineNetworkActions
          expanded={null}
          selected={[{ nicId: 1, linkId: 2 }, { nicId: 2 }]}
          setSelected={vi.fn()}
          systemId="abc123"
        />,
        { state, initialEntries: ["/machine/abc123"] }
      );
      await expectDisabledButtonWithTooltip(
        /Create bond/i,
        /A bond can only include physical interfaces/i
      );
    });

    it("disables the button when selected interfaces have different VLANS", async () => {
      state.machine.items = [
        factory.machineDetails({
          interfaces: [
            factory.machineInterface({
              id: 1,
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 1,
            }),
            factory.machineInterface({
              id: 2,
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 2,
            }),
          ],
          system_id: "abc123",
        }),
      ];

      renderWithProviders(
        <MachineNetworkActions
          expanded={null}
          selected={[{ nicId: 1, linkId: 2 }, { nicId: 2 }]}
          setSelected={vi.fn()}
          systemId="abc123"
        />,
        { state, initialEntries: ["/machine/abc123"] }
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
        factory.machineDetails({
          interfaces: [
            factory.machineInterface({
              id: 1,
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
          ],
          system_id: "abc123",
        }),
      ];
      const setSidePanelContent = vi.fn();
      vi.spyOn(sidePanelHooks, "useSidePanel").mockReturnValue({
        setSidePanelContent,
        sidePanelContent: null,
        setSidePanelSize: vi.fn(),
        sidePanelSize: "regular",
      });

      renderWithProviders(
        <MachineNetworkActions
          expanded={null}
          selected={[{ nicId: 1 }]}
          setSelected={vi.fn()}
          systemId="abc123"
        />,
        { state, initialEntries: ["/machine/abc123"] }
      );

      await userEvent.click(
        screen.getByRole("button", { name: /create bridge/i })
      );
      expect(setSidePanelContent).toHaveBeenCalledWith(
        expect.objectContaining({
          view: MachineSidePanelViews.ADD_BRIDGE,
        })
      );
    });

    it("disables the button when networking is disabled", async () => {
      state.machine.items[0].status = NodeStatus.DEPLOYED;

      renderWithProviders(
        <MachineNetworkActions
          expanded={null}
          selected={[]}
          setSelected={vi.fn()}
          systemId="abc123"
        />,
        { state, initialEntries: ["/machine/abc123"] }
      );

      await expectDisabledButtonWithTooltip(
        /Create bond/i,
        /Network can't be modified for this machine./i
      );
    });

    it("disables the button when no interfaces are selected", () => {
      renderWithProviders(
        <MachineNetworkActions
          expanded={null}
          selected={[]}
          setSelected={vi.fn()}
          systemId="abc123"
        />,
        { state, initialEntries: ["/machine/abc123"] }
      );

      expect(
        screen.getByRole("button", { name: /create bridge/i })
      ).toBeAriaDisabled();
    });

    it("disables the button when more than 1 interface is selected", async () => {
      state.machine.items = [
        factory.machineDetails({
          interfaces: [
            factory.machineInterface({
              id: 1,
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
            factory.machineInterface({
              id: 2,
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
          ],
          system_id: "abc123",
        }),
      ];

      renderWithProviders(
        <MachineNetworkActions
          expanded={null}
          selected={[{ nicId: 1 }, { nicId: 2 }]}
          setSelected={vi.fn()}
          systemId="abc123"
        />,
        { state, initialEntries: ["/machine/abc123"] }
      );

      await expectDisabledButtonWithTooltip(
        /create bridge/i,
        /A bridge can only be created from one interface/i
      );
    });

    it("disables the button when an alias is selected", async () => {
      state.machine.items = [
        factory.machineDetails({
          interfaces: [
            factory.machineInterface({
              id: 1,
              links: [
                factory.networkLink({ id: 1 }),
                factory.networkLink({ id: 2 }),
              ],
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 1,
            }),
            factory.machineInterface({
              id: 2,
              type: NetworkInterfaceTypes.PHYSICAL,
              vlan_id: 1,
            }),
          ],
          system_id: "abc123",
        }),
      ];

      renderWithProviders(
        <MachineNetworkActions
          expanded={null}
          selected={[{ nicId: 1, linkId: 2 }]}
          setSelected={vi.fn()}
          systemId="abc123"
        />,
        { state, initialEntries: ["/machine/abc123"] }
      );

      await expectDisabledButtonWithTooltip(
        /create bridge/i,
        /A bridge can not be created from an alias/i
      );
    });

    it("disables the button when a bridge is selected", async () => {
      state.machine.items = [
        factory.machineDetails({
          interfaces: [
            factory.machineInterface({
              id: 1,
              type: NetworkInterfaceTypes.BRIDGE,
            }),
            factory.machineInterface({
              id: 2,
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
          ],
          system_id: "abc123",
        }),
      ];

      renderWithProviders(
        <MachineNetworkActions
          expanded={null}
          selected={[{ nicId: 1 }, { nicId: 2 }]}
          setSelected={vi.fn()}
          systemId="abc123"
        />,
        { state, initialEntries: ["/machine/abc123"] }
      );

      await expectDisabledButtonWithTooltip(
        /create bridge/i,
        /A bridge can only be created from one interface/i
      );
    });
  });
});

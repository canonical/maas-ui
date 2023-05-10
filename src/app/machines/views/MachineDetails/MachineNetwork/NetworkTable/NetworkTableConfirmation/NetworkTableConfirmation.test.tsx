import configureStore from "redux-mock-store";

import NetworkTableConfirmation from "./NetworkTableConfirmation";

import { ExpandedState } from "app/base/components/NodeNetworkTab/NodeNetworkTab";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import type { NetworkInterface } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  networkLink as networkLinkFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("NetworkTableConfirmation", () => {
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
        ],
        loaded: true,
        statuses: {
          abc123: machineStatusFactory(),
        },
      }),
    });
  });

  it("does not display a confirmation if it is not expanded", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NetworkTableConfirmation
        expanded={null}
        nic={nic}
        setExpanded={jest.fn()}
        systemId="abc123"
      />,
      { store }
    );
    expect(
      screen.queryByText("Are you sure you want to remove this interface?")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Cancel" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Remove" })
    ).not.toBeInTheDocument();
  });

  describe("delete confirmation", () => {
    it("can display a delete confirmation for an interface", () => {
      const store = mockStore(state);
      renderWithBrowserRouter(
        <NetworkTableConfirmation
          expanded={{
            content: ExpandedState.REMOVE,
          }}
          nic={nic}
          setExpanded={jest.fn()}
          systemId="abc123"
        />,
        { store }
      );
      expect(
        screen.getByText("Are you sure you want to remove this interface?")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Remove" })
      ).toBeInTheDocument();
    });

    it("can confirm deleting an interface", async () => {
      const store = mockStore(state);
      renderWithBrowserRouter(
        <NetworkTableConfirmation
          expanded={{
            content: ExpandedState.REMOVE,
          }}
          nic={nic}
          setExpanded={jest.fn()}
          systemId="abc123"
        />,
        { store }
      );

      await userEvent.click(screen.getByRole("button", { name: "Remove" }));
      expect(
        store
          .getActions()
          .find((action) => action.type === "machine/deleteInterface")
      ).toStrictEqual({
        type: "machine/deleteInterface",
        meta: {
          method: "delete_interface",
          model: "machine",
        },
        payload: {
          params: {
            interface_id: nic.id,
            system_id: "abc123",
          },
        },
      });
    });

    it("can display a delete confirmation for an alias", () => {
      const link = networkLinkFactory();
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              discovered: null,
              links: [networkLinkFactory(), link],
              name: "alias",
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
          ],
          system_id: "abc123",
        }),
      ];
      const store = mockStore(state);
      renderWithBrowserRouter(
        <NetworkTableConfirmation
          expanded={{
            content: ExpandedState.REMOVE,
          }}
          link={link}
          nic={nic}
          setExpanded={jest.fn()}
          systemId="abc123"
        />,
        { store }
      );
      expect(
        screen.getByText("Are you sure you want to remove this Alias?")
      ).toBeInTheDocument();
    });

    it("can confirm deleting an alias", async () => {
      const link = networkLinkFactory();
      state.machine.items = [
        machineDetailsFactory({
          interfaces: [
            machineInterfaceFactory({
              discovered: null,
              links: [networkLinkFactory(), link],
              name: "alias",
              type: NetworkInterfaceTypes.PHYSICAL,
            }),
          ],
          system_id: "abc123",
        }),
      ];
      const store = mockStore(state);
      renderWithBrowserRouter(
        <NetworkTableConfirmation
          expanded={{
            content: ExpandedState.REMOVE,
          }}
          link={link}
          nic={nic}
          setExpanded={jest.fn()}
          systemId="abc123"
        />,
        { store }
      );
      await userEvent.click(screen.getByRole("button", { name: "Remove" }));
      expect(
        store
          .getActions()
          .find((action) => action.type === "machine/unlinkSubnet")
      ).toStrictEqual({
        type: "machine/unlinkSubnet",
        meta: {
          method: "unlink_subnet",
          model: "machine",
        },
        payload: {
          params: {
            interface_id: nic.id,
            link_id: link.id,
            system_id: "abc123",
          },
        },
      });
    });
  });

  describe("connect/disconnect confirmations", () => {
    it("can display a mark connected confirmation", () => {
      const store = mockStore(state);
      renderWithBrowserRouter(
        <NetworkTableConfirmation
          expanded={{
            content: ExpandedState.MARK_CONNECTED,
          }}
          nic={nic}
          setExpanded={jest.fn()}
          systemId="abc123"
        />,
        { store }
      );
      expect(
        screen.getByText(/Are you sure you want to mark it as connected\?/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Mark as connected" })
      ).toHaveClass("p-button--positive");
    });

    it("can display a mark disconnected confirmation", () => {
      const store = mockStore(state);
      renderWithBrowserRouter(
        <NetworkTableConfirmation
          expanded={{
            content: ExpandedState.MARK_DISCONNECTED,
          }}
          nic={nic}
          setExpanded={jest.fn()}
          systemId="abc123"
        />,
        { store }
      );

      expect(
        screen.getByText(/Are you sure you want to mark it as disconnected\?/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Mark as disconnected" })
      ).toHaveClass("p-button--negative");
    });

    it("can display a disconnected warning", () => {
      const store = mockStore(state);
      renderWithBrowserRouter(
        <NetworkTableConfirmation
          expanded={{
            content: ExpandedState.DISCONNECTED_WARNING,
          }}
          nic={nic}
          setExpanded={jest.fn()}
          systemId="abc123"
        />,
        { store }
      );

      expect(
        screen.getByText(/If this is no longer true, mark cable as connected./i)
      ).toHaveTextContent(
        /This interface is disconnected, it cannot be configured unless a cable is connected.If this is no longer true, mark cable as connected./i
      );
      expect(
        screen.getByRole("button", { name: "Mark as connected" })
      ).toHaveClass("p-button--positive");
    });

    it("can confirm marking connected", async () => {
      const store = mockStore(state);
      renderWithBrowserRouter(
        <NetworkTableConfirmation
          expanded={{
            content: ExpandedState.MARK_CONNECTED,
          }}
          nic={nic}
          setExpanded={jest.fn()}
          systemId="abc123"
        />,
        { store }
      );
      await userEvent.click(
        screen.getByRole("button", { name: "Mark as connected" })
      );
      expect(
        store
          .getActions()
          .find((action) => action.type === "machine/updateInterface")
      ).toStrictEqual({
        type: "machine/updateInterface",
        meta: {
          method: "update_interface",
          model: "machine",
        },
        payload: {
          params: {
            interface_id: nic.id,
            link_connected: true,
            system_id: "abc123",
          },
        },
      });
    });

    it("can confirm marking disconnected", async () => {
      const store = mockStore(state);
      renderWithBrowserRouter(
        <NetworkTableConfirmation
          expanded={{
            content: ExpandedState.MARK_DISCONNECTED,
          }}
          nic={nic}
          setExpanded={jest.fn()}
          systemId="abc123"
        />,
        { store }
      );
      await userEvent.click(
        screen.getByRole("button", { name: "Mark as disconnected" })
      );
      expect(
        store
          .getActions()
          .find((action) => action.type === "machine/updateInterface")
      ).toStrictEqual({
        type: "machine/updateInterface",
        meta: {
          method: "update_interface",
          model: "machine",
        },
        payload: {
          params: {
            interface_id: nic.id,
            link_connected: false,
            system_id: "abc123",
          },
        },
      });
    });
  });

  it("can display an add alias form", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NetworkTableConfirmation
        expanded={{
          content: ExpandedState.ADD_ALIAS,
        }}
        nic={nic}
        setExpanded={jest.fn()}
        systemId="abc123"
      />,
      { store }
    );
    expect(screen.getByRole("textbox", { name: "Type" })).toHaveValue("Alias");
    expect(
      screen.getByRole("button", { name: "Save interface" })
    ).toBeInTheDocument();
  });

  it("can display an add VLAN form", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NetworkTableConfirmation
        expanded={{
          content: ExpandedState.ADD_VLAN,
        }}
        nic={nic}
        setExpanded={jest.fn()}
        systemId="abc123"
      />,
      { store }
    );
    expect(screen.getByRole("textbox", { name: "Type" })).toHaveValue("VLAN");
    expect(
      screen.getByRole("button", { name: "Save interface" })
    ).toBeInTheDocument();
  });
});

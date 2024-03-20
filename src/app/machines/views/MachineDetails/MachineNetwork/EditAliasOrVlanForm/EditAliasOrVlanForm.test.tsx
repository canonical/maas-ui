import configureStore from "redux-mock-store";

import EditAliasOrVlanForm from "./EditAliasOrVlanForm";

import type { RootState } from "@/app/store/root/types";
import { NetworkInterfaceTypes, NetworkLinkMode } from "@/app/store/types/enum";
import type { NetworkInterface } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { userEvent, screen, renderWithBrowserRouter } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("EditAliasOrVlanForm", () => {
  let nic: NetworkInterface;
  let state: RootState;

  beforeEach(() => {
    nic = factory.machineInterface({
      id: 1,
    });
    state = factory.rootState({
      fabric: factory.fabricState({
        items: [factory.fabric({ id: 69 }), factory.fabric({ id: 420 })],
        loaded: true,
      }),
      machine: factory.machineState({
        items: [
          factory.machineDetails({
            interfaces: [nic],
            system_id: "abc123",
          }),
        ],
        statuses: factory.machineStatuses({
          abc123: factory.machineStatus(),
        }),
      }),
      subnet: factory.subnetState({
        items: [factory.subnet(), factory.subnet()],
        loaded: true,
      }),
      vlan: factory.vlanState({
        items: [factory.vlan({ fabric: 69, id: 1 })],
        loaded: true,
      }),
    });
  });

  it("fetches the necessary data on load", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditAliasOrVlanForm
        close={vi.fn()}
        interfaceType={NetworkInterfaceTypes.VLAN}
        nic={nic}
        systemId="abc123"
      />,
      { route: "/machines", store }
    );
    const expectedActions = ["fabric/fetch", "subnet/fetch", "vlan/fetch"];
    expectedActions.forEach((expectedAction) => {
      expect(
        store.getActions().some((action) => action.type === expectedAction)
      );
    });
  });

  it("displays a spinner when data is loading", () => {
    state.fabric.loaded = false;
    state.subnet.loaded = false;
    state.vlan.loaded = false;
    state.machine.items = [];
    renderWithBrowserRouter(
      <EditAliasOrVlanForm
        close={vi.fn()}
        interfaceType={NetworkInterfaceTypes.VLAN}
        nic={nic}
        systemId="abc123"
      />,
      { route: "/machines", state }
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays a tag field for a VLAN", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditAliasOrVlanForm
        close={vi.fn()}
        interfaceType={NetworkInterfaceTypes.VLAN}
        nic={nic}
        systemId="abc123"
      />,
      { route: "/machines", store }
    );
    expect(screen.getByRole("textbox", { name: "Tags" })).toBeInTheDocument();
  });

  it("dispatches an action to update an alias", async () => {
    const link = factory.networkLink({});
    nic.links = [factory.networkLink(), link];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditAliasOrVlanForm
        close={vi.fn()}
        interfaceType={NetworkInterfaceTypes.ALIAS}
        link={link}
        nic={nic}
        systemId="abc123"
      />,
      { route: "/machines", store }
    );

    await userEvent.click(screen.getByRole("button", { name: "Save Alias" }));
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
          fabric: "69",
          interface_id: nic.id,
          link_id: link.id,
          mode: NetworkLinkMode.AUTO,
          system_id: "abc123",
          vlan: "1",
        },
      },
    });
  });

  it("dispatches an action to update a VLAN", async () => {
    const link = factory.networkLink({ id: 101 });
    nic.links = [factory.networkLink(), link];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <EditAliasOrVlanForm
        close={vi.fn()}
        interfaceType={NetworkInterfaceTypes.VLAN}
        link={link}
        nic={nic}
        systemId="abc123"
      />,
      { route: "/machines", store }
    );

    await userEvent.click(screen.getByRole("button", { name: "Save Alias" }));

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
          fabric: "69",
          interface_id: nic.id,
          link_id: link.id,
          mode: NetworkLinkMode.AUTO,
          system_id: "abc123",
          tags: [],
          vlan: "1",
        },
      },
    });
  });
});

import NetworkDiscoverySubnetForm, {
  Labels as SubnetFormLabels,
} from "./NetworkDiscoverySubnetForm";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { ConfigNames, NetworkDiscovery } from "@/app/store/config/types";
import { subnetActions } from "@/app/store/subnet";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  userEvent,
  screen,
  renderWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);

describe("NetworkDiscoverySubnetForm", () => {
  it("displays a spinner if subnets have not loaded", () => {
    const state = factory.rootState({
      subnet: factory.subnetState({ loaded: false }),
    });
    renderWithProviders(<NetworkDiscoverySubnetForm />, {
      state,
    });

    expect(screen.getByText(SubnetFormLabels.Loading)).toBeInTheDocument();
  });

  it("displays a spinner if fabrics have not loaded", () => {
    const state = factory.rootState({
      fabric: factory.fabricState({ loaded: false }),
    });
    renderWithProviders(<NetworkDiscoverySubnetForm />, {
      state,
    });

    expect(screen.getByText(SubnetFormLabels.Loading)).toBeInTheDocument();
  });

  it("renders the form if fabrics and subnets have loaded", () => {
    const state = factory.rootState({
      fabric: factory.fabricState({ loaded: true }),
      subnet: factory.subnetState({ loaded: true }),
    });
    renderWithProviders(<NetworkDiscoverySubnetForm />, {
      state,
    });

    expect(
      screen.getByRole("form", { name: SubnetFormLabels.FormLabel })
    ).toBeInTheDocument();
  });

  it("disables the form if discovery is disabled", async () => {
    const state = factory.rootState({
      config: factory.configState({
        items: [
          {
            name: ConfigNames.NETWORK_DISCOVERY,
            value: NetworkDiscovery.DISABLED,
          },
        ],
      }),
      fabric: factory.fabricState({ loaded: true }),
      subnet: factory.subnetState({ items: [factory.subnet()], loaded: true }),
    });
    renderWithProviders(<NetworkDiscoverySubnetForm />, {
      state,
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Save" })).toBeAriaDisabled();
    });
    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeAriaDisabled();
    });
  });

  it("displays links for the subnet and its fabric", () => {
    const subnet = factory.subnet({ id: 1, active_discovery: true, vlan: 2 });
    const fabric = factory.fabric({ id: 3, vlan_ids: [2] });
    const state = factory.rootState({
      fabric: factory.fabricState({ items: [fabric], loaded: true }),
      subnet: factory.subnetState({ items: [subnet], loaded: true }),
    });
    renderWithProviders(<NetworkDiscoverySubnetForm />, {
      state,
    });

    expect(screen.getByRole("link", { name: "172.16.1.0/24" })).toHaveAttribute(
      "href",
      "/subnet/1"
    );
    expect(screen.getByRole("link", { name: "test-fabric-1" })).toHaveAttribute(
      "href",
      "/fabric/3"
    );
  });

  it("dispatches actions to update subnet active discovery if they have changed", async () => {
    const subnets = [
      factory.subnet({ id: 1, active_discovery: true }),
      factory.subnet({ id: 2, active_discovery: true }),
      factory.subnet({ id: 3, active_discovery: false }),
      factory.subnet({ id: 4, active_discovery: false }),
    ];
    const state = factory.rootState({
      fabric: factory.fabricState({ loaded: true }),
      subnet: factory.subnetState({ items: subnets, loaded: true }),
    });

    const { store } = renderWithProviders(<NetworkDiscoverySubnetForm />, {
      state,
    });

    const checkboxes = screen.getAllByRole("checkbox");

    await waitFor(() => {
      expect(checkboxes[1]).not.toBeAriaDisabled();
    });

    await userEvent.click(checkboxes[1]);
    await userEvent.click(checkboxes[2]);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    const expectedActions = [
      subnetActions.update({ id: 2, active_discovery: false }),
      subnetActions.update({ id: 3, active_discovery: true }),
    ];
    const actualActions = store.getActions();
    expect(
      actualActions.filter((action) => action.type === "subnet/update")
    ).toStrictEqual(expectedActions);
  });

  it("disables the form without edit permissions", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({
          entitlement: Entitlement.CAN_VIEW_CONFIGURATIONS,
        }),
      ])
    );
    const state = factory.rootState({
      fabric: factory.fabricState({ loaded: true }),
      subnet: factory.subnetState({ items: [factory.subnet()], loaded: true }),
    });
    renderWithProviders(<NetworkDiscoverySubnetForm />, {
      state,
    });

    await waitFor(() => {
      expect(screen.getAllByRole("checkbox")[0]).toBeAriaDisabled();
    });
    expect(
      screen.queryByRole("button", { name: "Save" })
    ).not.toBeInTheDocument();
  });
});

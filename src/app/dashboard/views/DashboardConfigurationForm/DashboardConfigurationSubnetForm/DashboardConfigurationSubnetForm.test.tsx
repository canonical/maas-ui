import configureStore from "redux-mock-store";

import DashboardConfigurationSubnetForm, {
  Labels as SubnetFormLabels,
} from "./DashboardConfigurationSubnetForm";

import { ConfigNames, NetworkDiscovery } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import {
  configState as configStateFactory,
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
} from "testing/factories";
import { userEvent, screen, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState, {}>();

describe("DashboardConfigurationSubnetForm", () => {
  it("displays a spinner if subnets have not loaded", () => {
    const state = rootStateFactory({
      subnet: subnetStateFactory({ loaded: false }),
    });
    renderWithBrowserRouter(<DashboardConfigurationSubnetForm />, {
      state,
    });

    expect(screen.getByText(SubnetFormLabels.Loading)).toBeInTheDocument();
  });

  it("displays a spinner if fabrics have not loaded", () => {
    const state = rootStateFactory({
      fabric: fabricStateFactory({ loaded: false }),
    });
    renderWithBrowserRouter(<DashboardConfigurationSubnetForm />, {
      state,
    });

    expect(screen.getByText(SubnetFormLabels.Loading)).toBeInTheDocument();
  });

  it("renders the form if fabrics and subnets have loaded", () => {
    const state = rootStateFactory({
      fabric: fabricStateFactory({ loaded: true }),
      subnet: subnetStateFactory({ loaded: true }),
    });
    renderWithBrowserRouter(<DashboardConfigurationSubnetForm />, {
      state,
    });

    expect(
      screen.getByRole("form", { name: SubnetFormLabels.FormLabel })
    ).toBeInTheDocument();
  });

  it("disables the form if discovery is disabled", () => {
    const state = rootStateFactory({
      config: configStateFactory({
        items: [
          {
            name: ConfigNames.NETWORK_DISCOVERY,
            value: NetworkDiscovery.DISABLED,
          },
        ],
      }),
      fabric: fabricStateFactory({ loaded: true }),
      subnet: subnetStateFactory({ items: [subnetFactory()], loaded: true }),
    });
    renderWithBrowserRouter(<DashboardConfigurationSubnetForm />, {
      state,
    });

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeDisabled();
    });
  });

  it("displays links for the subnet and its fabric", () => {
    const subnet = subnetFactory({ id: 1, active_discovery: true, vlan: 2 });
    const fabric = fabricFactory({ id: 3, vlan_ids: [2] });
    const state = rootStateFactory({
      fabric: fabricStateFactory({ items: [fabric], loaded: true }),
      subnet: subnetStateFactory({ items: [subnet], loaded: true }),
    });
    renderWithBrowserRouter(<DashboardConfigurationSubnetForm />, {
      state,
    });

    expect(screen.getByRole("link", { name: "172.16.1.0/24" })).toHaveProperty(
      "href",
      "http://example.com/subnet/1"
    );
    expect(screen.getByRole("link", { name: "test-fabric-1" })).toHaveProperty(
      "href",
      "http://example.com/fabric/3"
    );
  });

  it("dispatches actions to update subnet active discovery if they have changed", async () => {
    const subnets = [
      subnetFactory({ id: 1, active_discovery: true }),
      subnetFactory({ id: 2, active_discovery: true }),
      subnetFactory({ id: 3, active_discovery: false }),
      subnetFactory({ id: 4, active_discovery: false }),
    ];
    const state = rootStateFactory({
      fabric: fabricStateFactory({ loaded: true }),
      subnet: subnetStateFactory({ items: subnets, loaded: true }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<DashboardConfigurationSubnetForm />, {
      store,
    });

    const checkboxes = screen.getAllByRole("checkbox");

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
});

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AddSubnet from "./AddSubnet";

import { actions as subnetActions } from "app/store/subnet";
import {
  fabric as fabricFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
  fabricState as fabricSpaceFactory,
  rootState as rootStateFactory,
} from "testing/factories";

it("correctly dispatches space create action on form submit", async () => {
  const vlan_vid = 234;
  const vlan_id = 123;
  const vlan_id2 = 1234;
  const vlan_ids = [vlan_id, vlan_id2];
  const vlan_name = "vlan name";
  const store = configureStore()(
    rootStateFactory({
      fabric: fabricSpaceFactory({
        loaded: true,
        items: [fabricFactory({ id: 1, name: "space1", vlan_ids })],
      }),
      vlan: vlanStateFactory({
        loaded: true,
        items: [
          vlanFactory({
            id: vlan_id,
            vid: vlan_vid,
            name: vlan_name,
            fabric: 1,
          }),
          vlanFactory({
            id: vlan_id2,
            fabric: 1,
          }),
        ],
      }),
    })
  );

  render(
    <Provider store={store}>
      <MemoryRouter>
        <AddSubnet activeForm="Subnet" setActiveForm={() => undefined} />
      </MemoryRouter>
    </Provider>
  );

  const cidr = "192.168.0.1";
  const name = "Subnet name";

  userEvent.type(screen.getByRole("textbox", { name: /CIDR/ }), cidr);
  userEvent.type(screen.getByRole("textbox", { name: /Name/ }), name);

  userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Fabric & VLAN" }),
    "234 (vlan name)"
  );

  userEvent.click(screen.getByRole("button", { name: /Add Subnet/ }));

  await waitFor(() =>
    expect(store.getActions()).toStrictEqual([
      subnetActions.create({
        cidr,
        name,
        description: "",
        dns_servers: "",
        gateway_ip: "",
        vlan: vlan_id,
      }),
    ])
  );
});

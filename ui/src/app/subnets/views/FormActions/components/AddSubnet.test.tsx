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
  const vlan1 = vlanFactory({ id: 111, fabric: 5 });
  const vlan2 = vlanFactory({
    id: 222,
    vid: 333,
    name: "",
    fabric: 5,
  });
  const fabric = fabricFactory({
    id: 5,
    name: "space1",
    vlan_ids: [vlan1.id, vlan2.vid],
    default_vlan_id: vlan1.id,
  });

  const store = configureStore()(
    rootStateFactory({
      fabric: fabricSpaceFactory({
        loaded: true,
        items: [fabric],
      }),
      vlan: vlanStateFactory({
        loaded: true,
        items: [vlan1, vlan2],
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

  await screen.findByRole("combobox", { name: "VLAN" });
  userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Fabric" }),
    fabric.name
  );

  userEvent.selectOptions(
    screen.getByRole("combobox", { name: "VLAN" }),
    `${vlan2.vid}`
  );

  userEvent.click(screen.getByRole("button", { name: /Add Subnet/ }));

  await waitFor(() =>
    expect(store.getActions()).toStrictEqual([
      subnetActions.create({
        cidr,
        fabric: fabric.id,
        name,
        dns_servers: "",
        gateway_ip: "",
        vlan: vlan2.id,
      }),
    ])
  );
});

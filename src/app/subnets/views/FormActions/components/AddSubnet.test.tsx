import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
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
import { render, screen, waitFor } from "testing/utils";

it("correctly dispatches subnet cleanup and create actions on form submit", async () => {
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
        <CompatRouter>
          <AddSubnet activeForm="Subnet" setActiveForm={() => undefined} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  const cidr = "192.168.0.1";
  const name = "Subnet name";

  await userEvent.type(screen.getByRole("textbox", { name: /CIDR/ }), cidr);
  await userEvent.type(screen.getByRole("textbox", { name: /Name/ }), name);

  await waitFor(() =>
    expect(screen.getByRole("combobox", { name: "VLAN" })).toBeInTheDocument()
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Fabric" }),
    fabric.name
  );

  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "VLAN" }),
    `${vlan2.vid}`
  );

  await userEvent.click(screen.getByRole("button", { name: /Add Subnet/ }));

  await waitFor(() =>
    expect(store.getActions()).toStrictEqual([
      subnetActions.cleanup(),
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

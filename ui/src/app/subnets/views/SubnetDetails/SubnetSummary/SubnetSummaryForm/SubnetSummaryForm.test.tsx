import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import SubnetSummaryForm from "./SubnetSummaryForm";

import { actions as subnetActions } from "app/store/subnet";
import {
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
} from "testing/factories";

it("can dispatch an action to update the subnet", async () => {
  const fabrics = [
    fabricFactory({ default_vlan_id: 3, id: 1, vlan_ids: [3] }),
    fabricFactory({ default_vlan_id: 4, id: 2, vlan_ids: [4] }),
  ];
  const vlans = [
    vlanFactory({ fabric: 1, id: 3 }),
    vlanFactory({ fabric: 2, id: 4 }),
  ];
  const subnet = subnetFactory({
    active_discovery: false,
    allow_dns: false,
    allow_proxy: false,
    cidr: "192.168.1.0/24",
    description: "I'm a subnet",
    dns_servers: "abcde",
    gateway_ip: "192.168.1.1",
    managed: false,
    name: "Old Name",
    id: 5,
    vlan: vlans[0].id,
  });
  const state = rootStateFactory({
    fabric: fabricStateFactory({ items: fabrics, loaded: true }),
    subnet: subnetStateFactory({ items: [subnet], loaded: true }),
    vlan: vlanStateFactory({ items: vlans, loaded: true }),
  });
  const store = configureStore()(state);
  render(
    <Provider store={store}>
      <SubnetSummaryForm id={subnet.id} handleDismiss={jest.fn()} />
    </Provider>
  );

  fireEvent.input(screen.getByRole("textbox", { name: "CIDR" }), {
    target: { value: "192.168.2.0/24" },
  });
  fireEvent.input(screen.getByRole("textbox", { name: "Name" }), {
    target: { value: "New Name" },
  });
  fireEvent.input(screen.getByRole("textbox", { name: "Description" }), {
    target: { value: "I'm a supernet" },
  });
  fireEvent.input(screen.getByRole("textbox", { name: "Gateway IP" }), {
    target: { value: "192.168.2.1" },
  });
  fireEvent.input(screen.getByRole("textbox", { name: "DNS" }), {
    target: { value: "fghij" },
  });
  fireEvent.click(screen.getByRole("checkbox", { name: "Managed allocation" }));
  fireEvent.click(screen.getByRole("checkbox", { name: "Active discovery" }));
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Allow DNS resolution" })
  );
  fireEvent.click(screen.getByRole("checkbox", { name: "Proxy access" }));
  fireEvent.change(screen.getByRole("combobox", { name: "Fabric" }), {
    target: { value: fabrics[1].id.toString() },
  });

  fireEvent.change(screen.getByRole("combobox", { name: "VLAN" }), {
    target: { value: vlans[1].id.toString() },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save" }));

  const expectedAction = subnetActions.update({
    active_discovery: true,
    allow_dns: true,
    allow_proxy: true,
    cidr: "192.168.2.0/24",
    description: "I'm a supernet",
    dns_servers: "fghij",
    gateway_ip: "192.168.2.1",
    id: subnet.id,
    managed: true,
    name: "New Name",
    vlan: vlans[1].id,
  });
  const actualActions = store.getActions();

  await waitFor(() =>
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction)
  );
});

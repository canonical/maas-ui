import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import SubnetSummaryFormFields from "./SubnetSummaryFormFields";

import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  rootState as rootStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";
import { render, screen, waitFor } from "testing/utils";

it("updates to use the fabric's default VLAN on fabric change", async () => {
  const fabrics = [
    fabricFactory({ default_vlan_id: 3, id: 1, vlan_ids: [3] }),
    fabricFactory({ default_vlan_id: 5, id: 2, vlan_ids: [4, 5] }),
  ];
  const vlans = [
    vlanFactory({ fabric: 1, id: 3 }),
    vlanFactory({ fabric: 2, id: 4 }),
    vlanFactory({ fabric: 2, id: 5 }),
  ];
  const state = rootStateFactory({
    fabric: fabricStateFactory({ items: fabrics, loaded: true }),
    vlan: vlanStateFactory({ items: vlans, loaded: true }),
  });
  const store = configureStore()(state);
  render(
    <Provider store={store}>
      <Formik initialValues={{ fabric: 1, vlan: 3 }} onSubmit={jest.fn()}>
        <SubnetSummaryFormFields />
      </Formik>
    </Provider>
  );

  expect(screen.getByRole("combobox", { name: "VLAN" })).toHaveValue("3");

  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Fabric" }),
    fabrics[1].id.toString()
  );

  await waitFor(() =>
    expect(screen.getByRole("combobox", { name: "VLAN" })).toHaveValue("5")
  );
});

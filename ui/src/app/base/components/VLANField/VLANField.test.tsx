import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import VLANField from "./VLANField";

import type { RootState } from "app/store/root/types";
import {
  rootState as rootStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("VLANField", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      vlan: vlanStateFactory({
        items: [],
        loaded: true,
      }),
    });
  });

  it("shows a spinner if the vlans haven't loaded", () => {
    state.vlan.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ vlan: "" }} onSubmit={jest.fn()}>
          <VLANField />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays the vlan options", () => {
    const items = [
      vlanFactory({ id: 1, name: "vlan1", vid: 1 }),
      vlanFactory({ id: 2, name: "vlan2", vid: 2 }),
    ];
    state.vlan.items = items;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ vlan: "" }} onSubmit={jest.fn()}>
          <VLANField />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options")).toStrictEqual([
      {
        label: "1 (vlan1)",
        value: 1,
      },
      {
        label: "2 (vlan2)",
        value: 2,
      },
    ]);
  });
});

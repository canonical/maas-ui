import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import VLANSelect from "./VLANSelect";

import type { RootState } from "app/store/root/types";
import {
  rootState as rootStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("VLANSelect", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      vlan: vlanStateFactory({
        items: [
          vlanFactory({ id: 1, name: "vlan1", vid: 1, fabric: 3 }),
          vlanFactory({ id: 2, name: "vlan2", vid: 2, fabric: 4 }),
        ],
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
          <VLANSelect name="vlan" />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays the vlan options", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ vlan: "" }} onSubmit={jest.fn()}>
          <VLANSelect name="vlan" />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options")).toStrictEqual([
      { label: "Select VLAN", value: "" },
      {
        label: "1 (vlan1)",
        value: "1",
      },
      {
        label: "2 (vlan2)",
        value: "2",
      },
    ]);
  });

  it("can display a default option", () => {
    const store = mockStore(state);
    const defaultOption = {
      label: "Default",
      value: "99",
    };
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ vlan: "" }} onSubmit={jest.fn()}>
          <VLANSelect name="vlan" defaultOption={defaultOption} />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options")[0]).toStrictEqual(
      defaultOption
    );
  });

  it("can hide the default option", () => {
    state.vlan.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ vlan: "" }} onSubmit={jest.fn()}>
          <VLANSelect name="vlan" defaultOption={null} />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options").length).toBe(0);
  });

  it("filter the vlans by fabric", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ subnet: "" }} onSubmit={jest.fn()}>
          <VLANSelect name="vlan" fabric={3} />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options")).toStrictEqual([
      { label: "Select VLAN", value: "" },
      {
        label: "1 (vlan1)",
        value: "1",
      },
    ]);
  });

  it("can not show the default VLAN", () => {
    state.vlan.items = [
      vlanFactory({ id: 1, name: "vlan1", vid: 0, fabric: 3 }),
      vlanFactory({ id: 2, name: "vlan2", vid: 2, fabric: 4 }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ vlan: "" }} onSubmit={jest.fn()}>
          <VLANSelect includeDefaultVlan={false} name="vlan" />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options")).toStrictEqual([
      { label: "Select VLAN", value: "" },
      {
        label: "2 (vlan2)",
        value: "2",
      },
    ]);
  });
});

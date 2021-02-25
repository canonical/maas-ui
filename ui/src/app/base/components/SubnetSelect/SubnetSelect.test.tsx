import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import SubnetSelect from "./SubnetSelect";

import type { RootState } from "app/store/root/types";
import {
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("SubnetSelect", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      subnet: subnetStateFactory({
        items: [
          subnetFactory({
            id: 1,
            name: "sub1",
            cidr: "172.16.1.0/24",
            vlan: 3,
          }),
          subnetFactory({
            id: 2,
            name: "sub2",
            cidr: "172.16.2.0/24",
            vlan: 4,
          }),
        ],
        loaded: true,
      }),
    });
  });

  it("shows a spinner if the subnets haven't loaded", () => {
    state.subnet.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ subnet: "" }} onSubmit={jest.fn()}>
          <SubnetSelect name="subnet" />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays the subnet options", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ subnet: "" }} onSubmit={jest.fn()}>
          <SubnetSelect name="subnet" />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options")).toStrictEqual([
      { label: "Select subnet", value: "" },
      {
        label: "172.16.1.0/24 (sub1)",
        value: "1",
      },
      {
        label: "172.16.2.0/24 (sub2)",
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
        <Formik initialValues={{ subnet: "" }} onSubmit={jest.fn()}>
          <SubnetSelect name="subnet" defaultOption={defaultOption} />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options")[0]).toStrictEqual(
      defaultOption
    );
  });

  it("can hide the default option", () => {
    state.subnet.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ subnet: "" }} onSubmit={jest.fn()}>
          <SubnetSelect name="subnet" defaultOption={null} />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options").length).toBe(0);
  });

  it("filter the subnets by vlan", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ subnet: "" }} onSubmit={jest.fn()}>
          <SubnetSelect name="subnet" vlan={3} />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options")).toStrictEqual([
      { label: "Select subnet", value: "" },
      {
        label: "172.16.1.0/24 (sub1)",
        value: "1",
      },
    ]);
  });
});

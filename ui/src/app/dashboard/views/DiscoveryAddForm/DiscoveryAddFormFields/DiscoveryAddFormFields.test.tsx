import { Select } from "@canonical/react-components";
import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { DeviceType } from "../types";

import DiscoveryAddFormFields from "./DiscoveryAddFormFields";

import { DeviceIpAssignment } from "app/store/device/types";
import type { Discovery } from "app/store/discovery/types";
import type { RootState } from "app/store/root/types";
import {
  discovery as discoveryFactory,
  discoveryState as discoveryStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DiscoveryAddFormFields", () => {
  let state: RootState;
  let discovery: Discovery;

  beforeEach(() => {
    discovery = discoveryFactory();
    state = rootStateFactory({
      discovery: discoveryStateFactory({
        loaded: true,
        items: [discovery],
      }),
    });
  });

  it("shows fields for a device", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <Formik
            initialValues={{ type: DeviceType.DEVICE }}
            onSubmit={jest.fn()}
          >
            <DiscoveryAddFormFields discovery={discovery} />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[name='domain']").exists()).toBe(true);
    expect(wrapper.find("[name='parent']").exists()).toBe(true);
    expect(wrapper.find("[name='system_id']").exists()).toBe(false);
  });

  it("shows fields for an interface", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <Formik
            initialValues={{ type: DeviceType.INTERFACE }}
            onSubmit={jest.fn()}
          >
            <DiscoveryAddFormFields discovery={discovery} />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[name='system_id']").exists()).toBe(true);
    expect(wrapper.find("[name='domain']").exists()).toBe(false);
    expect(wrapper.find("[name='parent']").exists()).toBe(false);
  });

  it("includes static ip if there is a subnet", () => {
    discovery.subnet = 0;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <DiscoveryAddFormFields discovery={discovery} />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find("[name='ip_assignment']")
        .find(Select)
        .prop("options")
        ?.some(({ value }) => value === DeviceIpAssignment.STATIC)
    ).toBe(true);
  });

  it("does not includes static ip if there is no subnet", () => {
    discovery.subnet = null;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <DiscoveryAddFormFields discovery={discovery} />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .find("[name='ip_assignment']")
        .find(Select)
        .prop("options")
        ?.some(({ value }) => value === DeviceIpAssignment.STATIC)
    ).toBe(false);
  });
});

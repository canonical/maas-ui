import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import type { InterfaceFormValues } from "../InterfaceForm";

import InterfaceFormFields from "./InterfaceFormFields";

import { DeviceIpAssignment } from "app/store/device/types";
import type { RootState } from "app/store/root/types";
import {
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("InterfaceFormFields", () => {
  let initialValues: InterfaceFormValues;
  let state: RootState;
  beforeEach(() => {
    initialValues = {
      ip_address: "",
      ip_assignment: DeviceIpAssignment.DYNAMIC,
      mac_address: "",
      name: "",
      subnet: "",
      tags: [],
    };
    state = rootStateFactory({
      subnet: subnetStateFactory({
        items: [subnetFactory({ id: 1 }), subnetFactory({ id: 2 })],
        loaded: true,
      }),
    });
  });

  it("can render without headings", () => {
    initialValues.ip_assignment = DeviceIpAssignment.DYNAMIC;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={initialValues} onSubmit={jest.fn()}>
          <InterfaceFormFields />
        </Formik>
      </Provider>
    );

    expect(
      wrapper.find("[data-testid='interface-form-heading']").exists()
    ).toBe(false);
  });

  it("can render with headings", () => {
    initialValues.ip_assignment = DeviceIpAssignment.DYNAMIC;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={initialValues} onSubmit={jest.fn()}>
          <InterfaceFormFields showTitles />
        </Formik>
      </Provider>
    );

    expect(
      wrapper.find("[data-testid='interface-form-heading']").exists()
    ).toBe(true);
  });

  it("does not show subnet or IP address fields for dynamic IP assignment", () => {
    initialValues.ip_assignment = DeviceIpAssignment.DYNAMIC;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={initialValues} onSubmit={jest.fn()}>
          <InterfaceFormFields />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("[data-testid='subnet-field']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='ip-address-field']").exists()).toBe(
      false
    );
  });

  it("shows the IP address field for external IP assignment", () => {
    initialValues.ip_assignment = DeviceIpAssignment.EXTERNAL;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={initialValues} onSubmit={jest.fn()}>
          <InterfaceFormFields />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("[data-testid='subnet-field']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='ip-address-field']").exists()).toBe(
      true
    );
  });

  it("shows both the subnet and IP address fields for static IP assignment", () => {
    initialValues.ip_assignment = DeviceIpAssignment.STATIC;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={initialValues} onSubmit={jest.fn()}>
          <InterfaceFormFields />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("[data-testid='subnet-field']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='ip-address-field']").exists()).toBe(
      true
    );
  });

  it("clears subnet and IP address values when changing IP assignment", async () => {
    initialValues.ip_assignment = DeviceIpAssignment.STATIC;
    initialValues.subnet = 1;
    initialValues.ip_address = "192.168.1.1";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={initialValues} onSubmit={jest.fn()}>
          <InterfaceFormFields />
        </Formik>
      </Provider>
    );

    expect(
      wrapper.find("select[data-testid='subnet-field']").prop("value")
    ).toBe(1);
    expect(
      wrapper.find("input[data-testid='ip-address-field']").prop("value")
    ).toBe("192.168.1.1");

    // Change IP assignment to something else then back to the original value.
    wrapper
      .find("select[data-testid='ip-assignment-field']")
      .simulate("change", {
        target: { name: "ip_assignment", value: DeviceIpAssignment.DYNAMIC },
      });
    await waitForComponentToPaint(wrapper);
    wrapper
      .find("select[data-testid='ip-assignment-field']")
      .simulate("change", {
        target: { name: "ip_assignment", value: DeviceIpAssignment.STATIC },
      });
    await waitForComponentToPaint(wrapper);

    expect(
      wrapper.find("select[data-testid='subnet-field']").prop("value")
    ).toBe("");
    expect(
      wrapper.find("input[data-testid='ip-address-field']").prop("value")
    ).toBe("");
  });
});

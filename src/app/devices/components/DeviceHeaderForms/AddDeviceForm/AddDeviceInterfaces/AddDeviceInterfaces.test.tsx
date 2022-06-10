import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AddDeviceInterfaces from "../AddDeviceInterfaces";
import type { AddDeviceInterface } from "../types";

import { DeviceIpAssignment } from "app/store/device/types";
import type { RootState } from "app/store/root/types";
import {
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("AddDeviceInterfaces", () => {
  let interfaces: AddDeviceInterface[];
  let state: RootState;

  beforeEach(() => {
    interfaces = [
      {
        id: 0,
        ip_address: "",
        ip_assignment: DeviceIpAssignment.DYNAMIC,
        mac: "",
        name: "eth0",
        subnet: "",
      },
    ];
    state = rootStateFactory({
      subnet: subnetStateFactory({
        items: [subnetFactory({ id: 0, name: "default" })],
        loaded: true,
      }),
    });
  });

  it("does not show subnet or IP address fields for dynamic IP assignment", () => {
    interfaces[0].ip_assignment = DeviceIpAssignment.DYNAMIC;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <Formik initialValues={{ interfaces }} onSubmit={jest.fn()}>
            <AddDeviceInterfaces />
          </Formik>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='subnet-field']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='ip-address-field']").exists()).toBe(
      false
    );
  });

  it("shows the IP address field for external IP assignment", () => {
    interfaces[0].ip_assignment = DeviceIpAssignment.EXTERNAL;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <Formik initialValues={{ interfaces }} onSubmit={jest.fn()}>
            <AddDeviceInterfaces />
          </Formik>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='subnet-field']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='ip-address-field']").exists()).toBe(
      true
    );
  });

  it("shows both the subnet and IP address fields for static IP assignment", () => {
    interfaces[0].ip_assignment = DeviceIpAssignment.STATIC;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <Formik initialValues={{ interfaces }} onSubmit={jest.fn()}>
            <AddDeviceInterfaces />
          </Formik>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='subnet-field']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='ip-address-field']").exists()).toBe(
      true
    );
  });

  it("can add and remove interfaces", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <Formik initialValues={{ interfaces }} onSubmit={jest.fn()}>
            <AddDeviceInterfaces />
          </Formik>
        </MemoryRouter>
      </Provider>
    );

    const getRowCount = () =>
      wrapper.find("tr[data-testid='interface-row']").length;
    const getAddButton = () =>
      wrapper.find("button[data-testid='add-interface']");
    const getRemoveButton = () =>
      wrapper.find("button[data-testid='table-actions-delete']").at(0);

    // There is only one interface by default. Since at least one interface must
    // be defined, the remove button should be disabled.
    expect(getRowCount()).toBe(1);
    expect(getRemoveButton().prop("disabled")).toBe(true);

    // Add an interface.
    getAddButton().simulate("click");
    await waitForComponentToPaint(wrapper);

    expect(getRowCount()).toBe(2);
    expect(getRemoveButton().prop("disabled")).toBe(false);

    // Remove an interface.
    getRemoveButton().simulate("click");
    await waitForComponentToPaint(wrapper);

    expect(getRowCount()).toBe(1);
    expect(getRemoveButton().prop("disabled")).toBe(true);
  });
});

import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import EditInterface from "./EditInterface";

import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";
import type { DeviceNetworkInterface } from "app/store/device/types";
import { DeviceIpAssignment } from "app/store/device/types";
import type { RootState } from "app/store/root/types";
import {
  device as deviceFactory,
  deviceDetails as deviceDetailsFactory,
  deviceEventError as deviceEventErrorFactory,
  deviceInterface as deviceInterfaceFactory,
  deviceState as deviceStateFactory,
  deviceStatus as deviceStatusFactory,
  deviceStatuses as deviceStatusesFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("EditInterface", () => {
  let state: RootState;
  let nic: DeviceNetworkInterface;
  beforeEach(() => {
    nic = deviceInterfaceFactory();
    state = rootStateFactory({
      device: deviceStateFactory({
        items: [
          deviceDetailsFactory({
            interfaces: [nic],
            system_id: "abc123",
          }),
        ],
        loaded: true,
        statuses: deviceStatusesFactory({
          abc123: deviceStatusFactory(),
        }),
      }),
      subnet: subnetStateFactory({
        items: [subnetFactory({ id: 1 }), subnetFactory({ id: 2 })],
        loaded: true,
      }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("displays a spinner if device is not detailed version", () => {
    state.device.items[0] = deviceFactory({ system_id: "abc123" });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <EditInterface nicId={nic.id} systemId="abc123" closeForm={jest.fn()} />
      </Provider>
    );
    expect(
      wrapper.find("Spinner[data-testid='loading-device-details']").exists()
    ).toBe(true);
  });

  it("dispatches an action to update an interface", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <EditInterface nicId={nic.id} closeForm={jest.fn()} systemId="abc123" />
      </Provider>
    );
    const formValues = {
      ip_address: "192.168.1.1",
      ip_assignment: DeviceIpAssignment.STATIC,
      mac_address: "11:22:33:44:55:66",
      name: "eth123",
      subnet: 2,
      tags: ["tag1", "tag2"],
    };
    submitFormikForm(wrapper, formValues);
    const expectedAction = deviceActions.updateInterface({
      ...formValues,
      interface_id: nic.id,
      system_id: "abc123",
    });
    const actualAction = store
      .getActions()
      .find((action) => action.type === expectedAction.type);
    expect(actualAction).toStrictEqual(expectedAction);
  });

  it("closes the form if there are no errors when updating the interface", () => {
    const closeForm = jest.fn();
    state.device.errors = null;
    const store = mockStore(state);
    const Proxy = ({ systemId = "abc123" }) => (
      <Provider store={store}>
        <EditInterface
          nicId={nic.id}
          closeForm={closeForm}
          systemId={systemId}
        />
      </Provider>
    );
    const wrapper = mount(<Proxy />);
    const formValues = {
      ip_address: "192.168.1.1",
      ip_assignment: DeviceIpAssignment.STATIC,
      mac_address: "11:22:33:44:55:66",
      name: "eth123",
      subnet: 2,
      tags: ["tag1", "tag2"],
    };
    submitFormikForm(wrapper, formValues);
    const updatingInterface = jest.spyOn(deviceSelectors, "getStatusForDevice");
    updatingInterface.mockReturnValue(true);
    // Make the component rerender with the new value.
    store.dispatch({ type: "" });
    wrapper.setProps({});
    updatingInterface.mockReturnValue(false);
    // Make the component rerender with the new value.
    store.dispatch({ type: "" });
    wrapper.setProps({});
    expect(closeForm).toHaveBeenCalled();
  });

  it("does not close the form if there is an error when updating the interface", () => {
    const closeForm = jest.fn();
    state.device.errors = null;
    const store = mockStore(state);
    const Proxy = ({ systemId = "abc123" }) => (
      <Provider store={store}>
        <EditInterface
          nicId={nic.id}
          closeForm={closeForm}
          systemId={systemId}
        />
      </Provider>
    );
    const wrapper = mount(<Proxy />);
    const formValues = {
      ip_address: "192.168.1.1",
      ip_assignment: DeviceIpAssignment.STATIC,
      mac_address: "11:22:33:44:55:66",
      name: "eth123",
      subnet: 2,
      tags: ["tag1", "tag2"],
    };
    submitFormikForm(wrapper, formValues);
    const errors = jest.spyOn(deviceSelectors, "eventErrorsForDevices");
    errors.mockReturnValue([
      deviceEventErrorFactory({
        event: "updateInterface",
      }),
    ]);
    const updatingInterface = jest.spyOn(deviceSelectors, "getStatusForDevice");
    updatingInterface.mockReturnValue(true);
    // Make the component rerender with the new value.
    store.dispatch({ type: "" });
    wrapper.setProps({});
    updatingInterface.mockReturnValue(false);
    // Make the component rerender with the new value.
    store.dispatch({ type: "" });
    wrapper.setProps({});
    expect(closeForm).not.toHaveBeenCalled();
  });

  it("does not close the form if there is an error when submitting the form multiple times", () => {
    const closeForm = jest.fn();
    state.device.errors = null;
    const store = mockStore(state);
    const Proxy = ({ systemId = "abc123" }) => (
      <Provider store={store}>
        <EditInterface
          nicId={nic.id}
          closeForm={closeForm}
          systemId={systemId}
        />
      </Provider>
    );
    const wrapper = mount(<Proxy />);
    const formValues = {
      ip_address: "192.168.1.1",
      ip_assignment: DeviceIpAssignment.STATIC,
      mac_address: "11:22:33:44:55:66",
      name: "eth123",
      subnet: 2,
      tags: ["tag1", "tag2"],
    };
    submitFormikForm(wrapper, formValues);
    const errors = jest.spyOn(deviceSelectors, "eventErrorsForDevices");
    errors.mockReturnValue([
      deviceEventErrorFactory({
        event: "updateInterface",
      }),
    ]);
    const updatingInterface = jest.spyOn(deviceSelectors, "getStatusForDevice");
    updatingInterface.mockReturnValue(true);
    // Make the component rerender with the new value.
    store.dispatch({ type: "" });
    wrapper.setProps({});
    updatingInterface.mockReturnValue(false);
    // Make the component rerender with the new value.
    store.dispatch({ type: "" });
    wrapper.setProps({});
    errors.mockReturnValue([]);
    submitFormikForm(wrapper, formValues);
    updatingInterface.mockReturnValue(true);
    // Make the component rerender with the new value.
    store.dispatch({ type: "" });
    wrapper.setProps({});
    updatingInterface.mockReturnValue(false);
    // Mock an error for the second submission.
    errors.mockReturnValue([
      deviceEventErrorFactory({
        event: "updateInterface",
      }),
    ]);
    // Make the component rerender with the new value.
    store.dispatch({ type: "" });
    wrapper.setProps({});
    expect(closeForm).not.toHaveBeenCalled();
  });
});

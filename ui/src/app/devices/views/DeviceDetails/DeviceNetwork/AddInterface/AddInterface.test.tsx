import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import AddInterface from "./AddInterface";

import { actions as deviceActions } from "app/store/device";
import { DeviceIpAssignment } from "app/store/device/types";
import type { RootState } from "app/store/root/types";
import {
  device as deviceFactory,
  deviceDetails as deviceDetailsFactory,
  deviceState as deviceStateFactory,
  deviceStatus as deviceStatusFactory,
  deviceStatuses as deviceStatusesFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("AddInterface", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      device: deviceStateFactory({
        items: [
          deviceDetailsFactory({
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

  it("displays a spinner if device is not detailed version", () => {
    state.device.items[0] = deviceFactory({ system_id: "abc123" });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <AddInterface systemId="abc123" closeForm={jest.fn()} />
      </Provider>
    );

    expect(
      wrapper.find("[data-testid='loading-device-details']").exists()
    ).toBe(true);
  });

  it("correctly dispatches action to create an interface", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <AddInterface closeForm={jest.fn()} systemId="abc123" />
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

    const expectedAction = deviceActions.createInterface({
      ...formValues,
      system_id: "abc123",
    });
    const actualAction = store
      .getActions()
      .find((action) => action.type === expectedAction.type);
    expect(actualAction).toStrictEqual(expectedAction);
  });
});

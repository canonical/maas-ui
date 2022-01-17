import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeviceConfiguration from "./DeviceConfiguration";

import { actions as deviceActions } from "app/store/device";
import type { RootState } from "app/store/root/types";
import {
  deviceDetails as deviceDetailsFactory,
  deviceState as deviceStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("DeviceConfiguration", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      device: deviceStateFactory({
        items: [deviceDetailsFactory({ system_id: "abc123" })],
        loaded: true,
      }),
      zone: zoneStateFactory({
        loaded: true,
        items: [zoneFactory()],
      }),
    });
  });

  it("displays a spinner if the device has not loaded yet", () => {
    state.device.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <DeviceConfiguration systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='loading-device']").exists()).toBe(true);
  });

  it("shows the device details by default", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <DeviceConfiguration systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='device-details']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='device-config-form']").exists()).toBe(
      false
    );
  });

  it("can switch to showing the device configuration form", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <DeviceConfiguration systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find("button[data-testid='edit-device-button']").simulate("click");

    expect(wrapper.find("[data-testid='device-details']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='device-config-form']").exists()).toBe(
      true
    );
  });

  it("correctly dispatches an action to update a device", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <DeviceConfiguration systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find("button[data-testid='edit-device-button']").simulate("click");
    submitFormikForm(wrapper, {
      description: "it's a device",
      tags: [1, 2],
      zone: "twilight",
    });

    const expectedAction = deviceActions.update({
      description: "it's a device",
      tags: [1, 2],
      system_id: "abc123",
      zone: { name: "twilight" },
    });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});

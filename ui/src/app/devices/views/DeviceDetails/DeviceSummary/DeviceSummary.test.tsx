import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeviceSummary from "./DeviceSummary";

import {
  device as deviceFactory,
  deviceState as deviceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DeviceSummary", () => {
  it("shows a spinner if device has not loaded yet", () => {
    const state = rootStateFactory({
      device: deviceStateFactory({ items: [] }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <DeviceSummary systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='loading-device']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='device-summary']").exists()).toBe(false);
  });

  it("shows device summary once loaded", () => {
    const state = rootStateFactory({
      device: deviceStateFactory({
        items: [deviceFactory({ system_id: "abc123" })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <DeviceSummary systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='device-summary']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='loading-device']").exists()).toBe(false);
  });
});

import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeviceNetwork from "./DeviceNetwork";

import {
  deviceDetails as deviceDetailsFactory,
  deviceState as deviceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DeviceNetwork", () => {
  it("displays a spinner if device is loading", () => {
    const state = rootStateFactory({
      device: deviceStateFactory({
        items: [],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/device/abc123", key: "testKey" }]}
        >
          <DeviceNetwork systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
    expect(wrapper.find("NodeNetworkTab").exists()).toBe(false);
  });

  it("displays the network tab when loaded", () => {
    const state = rootStateFactory({
      device: deviceStateFactory({
        items: [deviceDetailsFactory({ system_id: "abc123" })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/device/abc123", key: "testKey" }]}
        >
          <DeviceNetwork systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("NodeNetworkTab").exists()).toBe(true);
    expect(wrapper.find("DHCPTable").exists()).toBe(true);
    expect(wrapper.find("Spinner").exists()).toBe(false);
  });
});

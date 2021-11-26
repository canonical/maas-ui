import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeviceDetailsHeader from "./DeviceDetailsHeader";

import { DeviceHeaderViews } from "app/devices/constants";
import type { RootState } from "app/store/root/types";
import {
  device as deviceFactory,
  deviceDetails as deviceDetailsFactory,
  deviceState as deviceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DeviceDetailsHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      device: deviceStateFactory({
        items: [deviceDetailsFactory({ system_id: "abc123" })],
      }),
    });
  });

  it("displays a spinner as the title if device has not loaded yet", () => {
    state.device.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <DeviceDetailsHeader
            headerContent={null}
            setHeaderContent={jest.fn()}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("SectionHeader").prop("loading")).toBe(true);
    expect(wrapper.find("SectionHeader").prop("subtitleLoading")).not.toBe(
      true
    );
  });

  it("displays a spinner as the subtitle if loaded device is not the detailed type", () => {
    state.device.items = [deviceFactory({ system_id: "abc123" })];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <DeviceDetailsHeader
            headerContent={null}
            setHeaderContent={jest.fn()}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("SectionHeader").prop("subtitleLoading")).toBe(true);
    expect(wrapper.find("SectionHeader").prop("loading")).not.toBe(true);
  });

  it("displays the device's FQDN once loaded", () => {
    state.device.items = [
      deviceDetailsFactory({ fqdn: "plot-device", system_id: "abc123" }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <DeviceDetailsHeader
            headerContent={null}
            setHeaderContent={jest.fn()}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='section-header-title']").text()).toBe(
      "plot-device"
    );
  });

  it("displays action title if an action is selected", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <DeviceDetailsHeader
            headerContent={{ view: DeviceHeaderViews.DELETE_DEVICE }}
            setHeaderContent={jest.fn()}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='section-header-title']").text()).toBe(
      "Delete"
    );
  });

  it("displays the device name if an action is not selected", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <DeviceDetailsHeader
            headerContent={null}
            setHeaderContent={jest.fn()}
            systemId="abc123"
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("DeviceName").exists()).toBe(true);
  });
});

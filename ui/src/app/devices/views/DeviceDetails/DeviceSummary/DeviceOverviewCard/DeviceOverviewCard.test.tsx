import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DeviceOverviewCard from "./DeviceOverviewCard";

import {
  device as deviceFactory,
  deviceDetails as deviceDetailsFactory,
  deviceState as deviceStateFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DeviceOverviewCard", () => {
  it("shows a spinner for the note if not device details", () => {
    const device = deviceFactory();
    const state = rootStateFactory({
      device: deviceStateFactory({ items: [device] }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DeviceOverviewCard systemId={device.system_id} />
      </Provider>
    );

    expect(wrapper.find("[data-testid='loading-note']").exists()).toBe(true);
  });

  it("shows note if device is device details", () => {
    const device = deviceDetailsFactory({ description: "description" });
    const state = rootStateFactory({
      device: deviceStateFactory({ items: [device] }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DeviceOverviewCard systemId={device.system_id} />
      </Provider>
    );

    expect(wrapper.find("[data-testid='loading-note']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='device-note']").text()).toBe(
      "description"
    );
  });

  it("shows a spinner for the tags if tags have not loaded", () => {
    const device = deviceDetailsFactory();
    const state = rootStateFactory({
      device: deviceStateFactory({ items: [device] }),
      tag: tagStateFactory({ loaded: false }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DeviceOverviewCard systemId={device.system_id} />
      </Provider>
    );

    expect(wrapper.find("[data-testid='loading-tags']").exists()).toBe(true);
  });

  it("shows tag names if tags have loaded", () => {
    const device = deviceDetailsFactory({ tags: [1, 2] });
    const tags = [
      tagFactory({ id: 1, name: "tag1" }),
      tagFactory({ id: 2, name: "tag2" }),
    ];
    const state = rootStateFactory({
      device: deviceStateFactory({ items: [device] }),
      tag: tagStateFactory({ items: tags, loaded: true }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DeviceOverviewCard systemId={device.system_id} />
      </Provider>
    );

    expect(wrapper.find("[data-testid='loading-tags']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='device-tags']").text()).toBe(
      "tag1, tag2"
    );
  });
});

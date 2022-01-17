import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import OwnerColumn from "./OwnerColumn";

import {
  device as deviceFactory,
  deviceState as deviceStateFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("OwnerColumn", () => {
  it("shows a spinner if tags have not loaded", () => {
    const device = deviceFactory();
    const state = rootStateFactory({
      device: deviceStateFactory({ items: [device] }),
      tag: tagStateFactory({ loaded: false }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <OwnerColumn systemId={device.system_id} />
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("shows tag names once loaded", () => {
    const device = deviceFactory({ tags: [1, 2] });
    const state = rootStateFactory({
      device: deviceStateFactory({ items: [device] }),
      tag: tagStateFactory({
        items: [
          tagFactory({ id: 1, name: "tag1" }),
          tagFactory({ id: 2, name: "tag2" }),
        ],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <OwnerColumn systemId={device.system_id} />
      </Provider>
    );

    expect(wrapper.find("[title='tag1, tag2']").exists()).toBe(true);
  });
});

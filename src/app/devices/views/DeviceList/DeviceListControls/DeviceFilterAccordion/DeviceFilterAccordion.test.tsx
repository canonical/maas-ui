import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeviceFilterAccordion from "./DeviceFilterAccordion";

import type { RootState } from "app/store/root/types";
import {
  device as deviceFactory,
  deviceState as deviceStateFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DeviceFilterAccordion", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      device: deviceStateFactory({
        items: [deviceFactory({ tags: [1] })],
        loaded: true,
      }),
      tag: tagStateFactory({
        items: [tagFactory({ id: 1, name: "echidna" })],
      }),
    });
  });

  it("is disabled if devices haven't loaded yet", () => {
    state.device.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/devices", key: "testKey" }]}
        >
          <DeviceFilterAccordion searchText="" setSearchText={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("FilterAccordion").prop("disabled")).toBe(true);
  });

  it("displays tags", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/devices", key: "testKey" }]}
        >
          <DeviceFilterAccordion searchText="" setSearchText={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    // Open the menu:
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    expect(wrapper.find("[data-testid='filter-tags']").last().text()).toBe(
      "echidna (1)"
    );
  });
});

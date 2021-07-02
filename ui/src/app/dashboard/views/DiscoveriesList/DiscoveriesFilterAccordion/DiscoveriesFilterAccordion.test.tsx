import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DiscoveriesFilterAccordion from "./DiscoveriesFilterAccordion";

import type { RootState } from "app/store/root/types";
import {
  discoveryState as discoveryStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DiscoveriesFilterAccordion", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      discovery: discoveryStateFactory({
        loaded: true,
      }),
    });
  });

  it("displays a spinner when loading discoveries", () => {
    state.discovery.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/discoveries", key: "testKey" }]}
        >
          <DiscoveriesFilterAccordion searchText="" setSearchText={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a filter accordion", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/discoveries", key: "testKey" }]}
        >
          <DiscoveriesFilterAccordion searchText="" setSearchText={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("FilterAccordion").exists()).toBe(true);
  });
});

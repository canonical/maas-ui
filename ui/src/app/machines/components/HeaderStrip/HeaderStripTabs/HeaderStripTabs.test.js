import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import HeaderStripTabs from "./HeaderStripTabs";

const mockStore = configureStore();

describe("HeaderStripTabs", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      machine: {
        loaded: true,
        items: [1],
      },
      resourcepool: {
        loaded: true,
        items: [1, 2],
      },
    };
  });

  it("displays tabs machine and resource pool counts if loaded", () => {
    const state = { ...initialState };
    state.machine.loaded = true;
    state.resourcepool.loaded = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <HeaderStripTabs />
        </MemoryRouter>
      </Provider>
    );
    const tabs = wrapper.find('[data-test="machine-list-tabs"]');
    expect(tabs.find("Link").at(0).text()).toBe("1 Machine");
    expect(tabs.find("Link").at(1).text()).toBe("2 Resource pools");
  });
});

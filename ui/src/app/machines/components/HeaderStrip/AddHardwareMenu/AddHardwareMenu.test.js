import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import AddHardwareMenu from "./AddHardwareMenu";

const mockStore = configureStore();

describe("AddHardwareMenu", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      general: {
        navigationOptions: {
          data: {
            rsd: false,
          },
        },
      },
      machine: {
        selected: [],
      },
    };
  });

  it("displays RSD link if in navigation state", () => {
    const state = { ...initialState };
    state.general.navigationOptions.data.rsd = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <AddHardwareMenu />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find('[data-test="add-hardware-dropdown"]').props().links.length
    ).toBe(3);
    expect(
      wrapper.find('[data-test="add-hardware-dropdown"]').props().links[2]
        .children
    ).toBe("RSD");
  });

  it("disables the Add hardware toggle menu when machines are selected", () => {
    const state = {
      ...initialState,
      machine: {
        selected: ["foo"],
      },
    };

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <AddHardwareMenu />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("ContextualMenu").props().toggleDisabled).toBe(true);
  });
});

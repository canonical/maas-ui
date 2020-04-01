import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import ActionFormWrapper from "./ActionFormWrapper";

const mockStore = configureStore();

describe("ActionFormWrapper", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      machine: {
        items: [],
        selected: [],
      },
    };
  });

  it(`displays a warning if not all selected machines can perform selected
  action`, () => {
    const state = { ...initialState };
    state.machine.items = [
      { system_id: "a", actions: ["commission"] },
      { system_id: "b", actions: [] },
    ];
    state.machine.selected = ["a", "b"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionFormWrapper
            selectedAction={{ name: "commission" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='machine-action-warning']").exists()).toBe(
      true
    );
  });

  it("can set selected machines to those that can perform action", () => {
    const state = { ...initialState };
    state.machine.items = [
      { system_id: "a", actions: ["commission"] },
      { system_id: "b", actions: [] },
    ];
    state.machine.selected = ["a", "b"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionFormWrapper
            selectedAction={{ name: "commission" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper
      .find('[data-test="select-actionable-machines"] button')
      .simulate("click");

    expect(
      store
        .getActions()
        .find((action) => action.type === "SET_SELECTED_MACHINES")
    ).toStrictEqual({
      type: "SET_SELECTED_MACHINES",
      payload: ["a"],
    });
  });
});

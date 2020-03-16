import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import ActionForm from "./ActionForm";

const mockStore = configureStore();

describe("ActionForm", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      machine: {
        errors: {},
        loading: false,
        loaded: true,
        items: [
          {
            system_id: "abc123"
          }
        ],
        selected: []
      }
    };
  });

  it("renders", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionForm
            selectedAction={{ name: "commission" }}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("ActionForm")).toMatchSnapshot();
  });

  it("can unset the selected action", () => {
    const state = { ...initialState };
    state.machine.items = [{ system_id: "a", actions: ["commission"] }];
    state.machine.selected = ["a"];
    const store = mockStore(state);
    const setSelectedAction = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ActionForm
            selectedAction={{ name: "commission" }}
            setSelectedAction={setSelectedAction}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find('[data-test="cancel-action"] button').simulate("click");

    expect(setSelectedAction).toHaveBeenCalledWith(null);
  });
});

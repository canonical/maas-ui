import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { UserAdd } from "./UserAdd";

const mockStore = configureStore();

describe("UserAdd", () => {
  let state;

  beforeEach(() => {
    state = {
      config: { items: [] },
      status: {},
      user: { auth: {} },
    };
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/users/add", key: "testKey" }]}
        >
          <UserAdd />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("UserAdd").exists()).toBe(true);
  });
});

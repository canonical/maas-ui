import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import Preferences from "./Preferences";

const mockStore = configureStore();

describe("Preferences", () => {
  it("renders", () => {
    const store = mockStore({
      messages: {
        items: []
      }
    });
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/preferences", key: "testKey" }]}
        >
          <Preferences />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Section").exists()).toBe(true);
  });
});

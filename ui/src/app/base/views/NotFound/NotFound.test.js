import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import NotFound from "./NotFound";

const mockStore = configureStore();

describe("NotFound ", () => {
  let state;

  beforeEach(() => {
    state = {
      config: {
        items: [],
      },
      messages: {
        items: [],
      },
      notification: {
        items: [],
      },
    };
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/404", key: "testKey" }]}>
          <NotFound />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("NotFound")).toMatchSnapshot();
  });

  it("can render in a section", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/404", key: "testKey" }]}>
          <NotFound includeSection />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Section").exists()).toBe(true);
  });
});

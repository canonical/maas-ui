import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { routerState as routerStateFactory } from "testing/factories";
import NotFound from "./NotFound";

const mockStore = configureStore();

describe("NotFound ", () => {
  let state;

  beforeEach(() => {
    state = {
      config: {
        items: [],
      },
      general: {
        version: {
          data: "2.8.0",
          loaded: true,
          loading: false,
        },
      },
      messages: {
        items: [],
      },
      notification: {
        items: [],
      },
      router: routerStateFactory(),
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

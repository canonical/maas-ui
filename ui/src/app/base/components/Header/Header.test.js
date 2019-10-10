import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { Header } from "./Header";

const mockStore = configureStore();

describe("Header", () => {
  let state;

  beforeEach(() => {
    process.env.REACT_APP_MAAS_URL = "http://maas.local:5240/MAAS";
    state = {
      messages: {
        items: []
      },
      status: {
        connected: true
      },
      user: {
        auth: {
          loading: false,
          user: {}
        }
      }
    };
  });

  afterEach(() => {
    jest.resetModules();
  });

  it("renders", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <Header />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Header")).toMatchSnapshot();
  });

  it("can handle a logged out user", () => {
    state.user.auth.user = null;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <Header />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("nav").exists()).toBe(false);
  });
});

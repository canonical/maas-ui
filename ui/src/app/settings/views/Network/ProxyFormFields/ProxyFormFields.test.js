import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";

import ProxyForm from "../ProxyForm";

const mockStore = configureStore();

describe("ProxyFormFields", () => {
  let state;
  beforeEach(() => {
    state = {
      config: {
        loading: false,
        loaded: true,
        items: [
          {
            name: "http_proxy",
            value: "http://www.url.com"
          },
          {
            name: "enable_http_proxy",
            value: false
          },
          {
            name: "use_peer_proxy",
            value: false
          }
        ]
      }
    };
  });

  it("can render", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/network", key: "testKey" }]}
        >
          <ProxyForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("ProxyFormFields").exists()).toBe(true);
  });
});

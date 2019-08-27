import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import DhcpList from "./DhcpList";

const mockStore = configureStore();

describe("DhcpList", () => {
  let state;

  beforeEach(() => {
    state = {
      dhcpsnippet: {
        loading: false,
        loaded: true,
        items: [{ id: 1, name: "class" }, { id: 2, name: "lease", subnet: 2 }]
      },
      subnet: {
        loading: false,
        loaded: true,
        items: [{ id: 1, name: "10.0.0.99" }, { id: 2, name: "test.maas" }]
      }
    };
  });

  it("displays a loading component if loading", () => {
    state.dhcpsnippet.loading = true;
    state.subnet.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DhcpList />
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("displays a list of dhcp snippets", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DhcpList />
      </Provider>
    );
    expect(wrapper.find("DhcpList")).toMatchSnapshot();
  });
});

import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter, Route } from "react-router-dom";

import { DhcpEdit } from "./DhcpEdit";

const mockStore = configureStore();

describe("DhcpEdit", () => {
  let state;

  beforeEach(() => {
    state = {
      config: {
        items: [],
      },
      controller: { items: [] },
      device: { items: [] },
      dhcpsnippet: {
        errors: {},
        items: [
          {
            created: "Thu, 15 Aug. 2019 06:21:39",
            id: 1,
            name: "lease",
            updated: "Thu, 15 Aug. 2019 06:21:39",
            value: "lease 10",
          },
          {
            created: "Thu, 15 Aug. 2019 06:21:39",
            id: 2,
            name: "class",
            updated: "Thu, 15 Aug. 2019 06:21:39",
          },
        ],
        loaded: true,
        loading: false,
        saving: false,
        saved: false,
      },
      machine: { items: [] },
      subnet: { items: [] },
    };
  });

  it("displays a loading component if loading", () => {
    state.dhcpsnippet.loading = true;
    state.dhcpsnippet.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/dhcp/1/edit", key: "testKey" },
          ]}
        >
          <DhcpEdit />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("handles dhcp snippet not found", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/dhcp/99999/edit", key: "testKey" },
          ]}
        >
          <DhcpEdit />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("h4").text()).toBe("DHCP snippet not found");
  });

  it("can display a dhcp snippet edit form", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/dhcp/1/edit", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/settings/dhcp/:id/edit"
            component={(props) => <DhcpEdit {...props} />}
          />
        </MemoryRouter>
      </Provider>
    );
    const form = wrapper.find("DhcpForm");
    expect(form.exists()).toBe(true);
    expect(form.prop("dhcpSnippet")).toStrictEqual(state.dhcpsnippet.items[0]);
  });
});

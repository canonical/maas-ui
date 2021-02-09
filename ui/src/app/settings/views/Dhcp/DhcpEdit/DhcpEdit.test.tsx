import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import { DhcpEdit } from "./DhcpEdit";

import type { RootState } from "app/store/root/types";
import {
  dhcpSnippet as dhcpSnippetFactory,
  dhcpSnippetState as dhcpSnippetStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DhcpEdit", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      dhcpsnippet: dhcpSnippetStateFactory({
        items: [
          dhcpSnippetFactory({
            id: 1,
          }),
          dhcpSnippetFactory({
            id: 2,
          }),
        ],
        loaded: true,
      }),
    });
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
    expect(wrapper.find("Spinner").exists()).toBe(true);
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
            component={() => <DhcpEdit />}
          />
        </MemoryRouter>
      </Provider>
    );
    const form = wrapper.find("DhcpForm").first();
    expect(form.exists()).toBe(true);
    expect(form.prop("dhcpSnippet")).toStrictEqual(state.dhcpsnippet.items[0]);
  });
});

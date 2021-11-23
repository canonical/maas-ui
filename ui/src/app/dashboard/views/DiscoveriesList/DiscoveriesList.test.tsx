import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DiscoveriesList from "./DiscoveriesList";

import type { RootState } from "app/store/root/types";
import {
  discovery as discoveryFactory,
  discoveryState as discoveryStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DiscoveriesList", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      discovery: discoveryStateFactory({
        loaded: true,
        items: [
          discoveryFactory({
            hostname: "my-discovery-test",
          }),
          discoveryFactory({
            hostname: "another-test",
          }),
        ],
      }),
    });
  });

  it("displays the discoveries", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <DiscoveriesList />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.text().includes("my-discovery-test")).toBe(true);
    expect(wrapper.text().includes("another-test")).toBe(true);
  });

  it("displays a spinner within table when loading", () => {
    state = rootStateFactory({
      discovery: discoveryStateFactory({
        loading: true,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <DiscoveriesList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("MainTable Spinner").exists()).toBe(true);
  });

  it("displays a message when there are no discoveries", () => {
    state = rootStateFactory({
      discovery: discoveryStateFactory({
        loaded: true,
        items: [],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <DiscoveriesList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='no-discoveries']").exists()).toBe(true);
    expect(wrapper.find("MainTable").exists()).toBe(false);
  });

  it("can display the add form", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <DiscoveriesList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='add-discovery']").exists()).toBe(false);
    wrapper
      .find("[data-test='row-menu'] .row-menu-toggle")
      .first()
      .simulate("click");
    wrapper
      .find("button[data-test='add-discovery-link']")
      .first()
      .simulate("click");
    expect(wrapper.find("[data-test='add-discovery']").exists()).toBe(true);
  });

  it("can display the delete form", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <DiscoveriesList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-test='delete-discovery']").exists()).toBe(false);
    wrapper
      .find("[data-test='row-menu'] .row-menu-toggle")
      .first()
      .simulate("click");
    wrapper
      .find("button[data-test='delete-discovery-link']")
      .first()
      .simulate("click");
    expect(wrapper.find("[data-test='delete-discovery']").exists()).toBe(true);
  });

  it("can delete a discovery", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/dashboard", key: "testKey" }]}
        >
          <DiscoveriesList />
        </MemoryRouter>
      </Provider>
    );
    // Open the action menu.
    wrapper
      .find("[data-test='row-menu'] .row-menu-toggle")
      .first()
      .simulate("click");
    // Click on the delete link.
    wrapper
      .find("button[data-test='delete-discovery-link']")
      .first()
      .simulate("click");
    // Click on the confirm button.
    wrapper
      .find("[data-test='delete-discovery'] [data-test='action-confirm']")
      .last()
      .simulate("click");
    expect(
      store.getActions().some((action) => action.type === "discovery/delete")
    ).toBe(true);
  });
});

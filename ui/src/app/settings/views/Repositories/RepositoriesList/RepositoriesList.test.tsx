import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import RepositoriesList from "./RepositoriesList";

import type { RootState } from "app/store/root/types";
import {
  packageRepository as packageRepositoryFactory,
  packageRepositoryState as packageRepositoryStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("RepositoriesList", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      packagerepository: packageRepositoryStateFactory({
        loaded: true,
        items: [
          packageRepositoryFactory({
            id: 1,
            name: "main_archive",
            url: "http://archive.ubuntu.com/ubuntu",
            default: true,
            enabled: true,
          }),
          packageRepositoryFactory({
            id: 2,
            name: "ports_archive",
            url: "http://ports.ubuntu.com/ubuntu-ports",
            default: true,
            enabled: true,
          }),
          packageRepositoryFactory({
            id: 3,
            name: "extra_archive",
            url: "http://maas.io",
            default: false,
            enabled: true,
          }),
          packageRepositoryFactory({
            id: 4,
            name: "secret_archive",
            url: "http://www.website.com",
            default: false,
            enabled: false,
          }),
        ],
      }),
    });
  });

  it("displays a loading component if loading", () => {
    state.packagerepository.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories", key: "testKey" },
          ]}
        >
          <RepositoriesList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("shows the table if there are repositories and loaded is true", () => {
    state.packagerepository.loaded = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories", key: "testKey" },
          ]}
        >
          <RepositoriesList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("MainTable").exists()).toBe(true);
  });

  it("can show a delete confirmation", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories", key: "testKey" },
          ]}
        >
          <RepositoriesList />
        </MemoryRouter>
      </Provider>
    );
    let row = wrapper.find("TableRow[data-testid='repository-row']").at(2);
    expect(row.hasClass("is-active")).toBe(false);
    // Click on the delete button:
    wrapper.find("TableRow").at(3).find("Button").at(1).simulate("click");
    row = wrapper.find("TableRow[data-testid='repository-row']").at(2);
    expect(row.hasClass("is-active")).toBe(true);
  });

  it("can delete a repository", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories", key: "testKey" },
          ]}
        >
          <RepositoriesList />
        </MemoryRouter>
      </Provider>
    );
    // Click on the delete button:
    wrapper.find("TableRow").at(3).find("Button").at(1).simulate("click");
    // Click on the delete confirm button
    wrapper
      .find("TableRow")
      .at(3)
      .find("ActionButton[data-testid='action-confirm']")
      .simulate("click");

    // 1. Fetch, 2. Cleanup, 3. Delete
    expect(store.getActions()[2]).toEqual({
      type: "packagerepository/delete",
      payload: {
        params: {
          id: 3,
        },
      },
      meta: {
        model: "packagerepository",
        method: "delete",
      },
    });
  });

  it("can filter repositories", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories", key: "testKey" },
          ]}
        >
          <RepositoriesList />
        </MemoryRouter>
      </Provider>
    );
    let rows = wrapper.find("TableRow[data-testid='repository-row']");
    expect(rows.length).toBe(state.packagerepository.items.length);
    wrapper
      .find("SearchBox input")
      .simulate("change", { target: { name: "search", value: "secret" } });
    wrapper.update();
    rows = wrapper.find("TableRow[data-testid='repository-row']");
    expect(rows.length).toBe(1);
  });

  it("displays default repositories with user-friendly names", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories", key: "testKey" },
          ]}
        >
          <RepositoriesList />
        </MemoryRouter>
      </Provider>
    );
    const mainRepoRow = wrapper
      .find("TableRow[data-testid='repository-row']")
      .at(0);
    const extraRepoRow = wrapper
      .find("TableRow[data-testid='repository-row']")
      .at(1);
    expect(mainRepoRow.find("TableCell").first().text()).toBe("Ubuntu archive");
    expect(extraRepoRow.find("TableCell").first().text()).toBe(
      "Ubuntu extra architectures"
    );
  });

  it("adds a message and cleans up packagerepository state when a repo is deleted", () => {
    state.packagerepository.saved = true;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories", key: "testKey" },
          ]}
        >
          <RepositoriesList />
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(
      actions.some((action) => action.type === "packagerepository/cleanup")
    ).toBe(true);
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });
});

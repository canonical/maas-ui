import { screen, render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
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
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <RepositoriesList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("shows the table if there are repositories and loaded is true", () => {
    state.packagerepository.loaded = true;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <RepositoriesList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByLabelText("Package repositories")).toBeInTheDocument();
  });

  it("can show a delete confirmation", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <RepositoriesList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.queryByRole("row", {
        name: "secret_archive http://www.website.com No Edit Delete",
      })
    ).not.toHaveClass("is-active");

    await userEvent.click(
      within(
        screen.getByRole("row", {
          name: "secret_archive http://www.website.com No Edit Delete",
        })
      ).getByTestId("table-actions-delete")
    );

    expect(
      screen.getByText(
        `Are you sure you want to delete repository "secret_archive"?`
      )
    ).toBeInTheDocument();
  });

  it("can delete a repository", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <RepositoriesList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    // Click on the delete button:
    await userEvent.click(
      within(
        screen.getByRole("row", {
          name: "secret_archive http://www.website.com No Edit Delete",
        })
      ).getByTestId("table-actions-delete")
    );

    // Click on the delete confirm button
    await userEvent.click(
      within(
        screen.getByRole("row", {
          name: `secret_archive http://www.website.com No Edit Delete Are you sure you want to delete repository "secret_archive"? This action is permanent and can not be undone. Cancel Delete`,
        })
      ).getByTestId("action-confirm")
    );

    // 1. Fetch, 2. Cleanup, 3. Delete
    expect(store.getActions()[2]).toEqual({
      type: "packagerepository/delete",
      payload: {
        params: {
          id: 4,
        },
      },
      meta: {
        model: "packagerepository",
        method: "delete",
      },
    });
  });

  it("can filter repositories", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <RepositoriesList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    let rows = screen.getAllByTestId("repository-row");
    expect(rows.length).toBe(state.packagerepository.items.length);

    await userEvent.type(
      screen.getByRole("searchbox", { name: "Search package repositories" }),
      "secret"
    );

    rows = screen.getAllByTestId("repository-row");
    expect(rows.length).toBe(1);
  });

  it("displays default repositories with user-friendly names", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <RepositoriesList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const mainRepoRow = screen.getAllByTestId("repository-row")[0];
    const extraRepoRow = screen.getAllByTestId("repository-row")[1];

    expect(within(mainRepoRow).getByText("Ubuntu archive")).toBeInTheDocument();
    expect(
      within(extraRepoRow).getByText("Ubuntu extra architectures")
    ).toBeInTheDocument();
  });

  it("adds a message and cleans up packagerepository state when a repo is deleted", () => {
    state.packagerepository.saved = true;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <RepositoriesList />
          </CompatRouter>
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

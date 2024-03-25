import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import RepositoriesList, {
  Labels as RepositoriesListLabels,
} from "./RepositoriesList";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  render,
  within,
  renderWithMockStore,
  renderWithBrowserRouter,
} from "@/testing/utils";

const mockStore = configureStore();

describe("RepositoriesList", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      packagerepository: factory.packageRepositoryState({
        loaded: true,
        items: [
          factory.packageRepository({
            id: 1,
            name: "main_archive",
            url: "http://archive.ubuntu.com/ubuntu",
            default: true,
            enabled: true,
          }),
          factory.packageRepository({
            id: 2,
            name: "ports_archive",
            url: "http://ports.ubuntu.com/ubuntu-ports",
            default: true,
            enabled: true,
          }),
          factory.packageRepository({
            id: 3,
            name: "extra_archive",
            url: "http://maas.io",
            default: false,
            enabled: true,
          }),
          factory.packageRepository({
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
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[
          { pathname: "/settings/repositories", key: "testKey" },
        ]}
      >
        <CompatRouter>
          <RepositoriesList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("shows the table if there are repositories and loaded is true", () => {
    state.packagerepository.loaded = true;
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[
          { pathname: "/settings/repositories", key: "testKey" },
        ]}
      >
        <CompatRouter>
          <RepositoriesList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByLabelText("Package repositories")).toBeInTheDocument();
  });

  it("can show a delete confirmation", async () => {
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[
          { pathname: "/settings/repositories", key: "testKey" },
        ]}
      >
        <CompatRouter>
          <RepositoriesList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    expect(
      screen.queryByRole("row", {
        name: "secret_archive",
      })
    ).not.toHaveClass("is-active");

    await userEvent.click(
      within(
        within(
          screen.getByRole("row", {
            name: "secret_archive",
          })
        ).getByLabelText(RepositoriesListLabels.Actions)
      ).getByRole("button", { name: "Delete" })
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
        within(
          screen.getByRole("row", {
            name: "secret_archive",
          })
        ).getByRole("gridcell", { name: RepositoriesListLabels.Actions })
      ).getByRole("button", { name: "Delete" })
    );

    // Click on the delete confirm button
    await userEvent.click(
      within(
        within(
          screen.getByRole("row", {
            name: "secret_archive",
          })
        ).getByRole("gridcell", {
          name: `Are you sure you want to delete repository "secret_archive"? This action is permanent and can not be undone. Cancel Delete`,
        })
      ).getByRole("button", { name: "Delete" })
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
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[
          { pathname: "/settings/repositories", key: "testKey" },
        ]}
      >
        <CompatRouter>
          <RepositoriesList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    let rows = screen.getAllByTestId("repository-row");
    expect(rows.length).toBe(state.packagerepository.items.length);

    await userEvent.type(
      screen.getAllByPlaceholderText(
        RepositoriesListLabels.SearchboxPlaceholder
      )[0],
      "secret"
    );

    rows = screen.getAllByTestId("repository-row");
    expect(rows.length).toBe(1);
  });

  it("displays default repositories with user-friendly names", () => {
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[
          { pathname: "/settings/repositories", key: "testKey" },
        ]}
      >
        <CompatRouter>
          <RepositoriesList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
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

  it("displays a message when there are no repositories", () => {
    state.packagerepository.items = [];

    renderWithBrowserRouter(<RepositoriesList />, {
      state,
      route: "/settings/repositories",
    });

    expect(screen.getByText("No repositories available.")).toBeInTheDocument();
  });
});

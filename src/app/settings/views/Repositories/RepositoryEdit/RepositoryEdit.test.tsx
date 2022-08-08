import { screen, render, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import RepositoryEdit from "./RepositoryEdit";

import type { RootState } from "app/store/root/types";
import {
  componentsToDisableState as componentsToDisableStateFactory,
  knownArchitecturesState as knownArchitecturesStateFactory,
  packageRepository as packageRepositoryFactory,
  packageRepositoryState as packageRepositoryStateFactory,
  pocketsToDisableState as pocketsToDisableStateFactory,
  generalState as generalStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("RepositoryEdit", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        componentsToDisable: componentsToDisableStateFactory({
          loaded: true,
        }),
        knownArchitectures: knownArchitecturesStateFactory({
          loaded: true,
        }),
        pocketsToDisable: pocketsToDisableStateFactory({
          loaded: true,
        }),
      }),
      packagerepository: packageRepositoryStateFactory({
        loaded: true,
        items: [
          packageRepositoryFactory({
            id: 1,
            name: "test",
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
            {
              pathname: "/settings/repositories/edit/repository/1",
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <Routes>
              <Route
                element={<RepositoryEdit />}
                path="/settings/repositories/edit/:type/:id"
              />
            </Routes>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    // expect(wrapper.find("Spinner").exists()).toBe(true);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("handles repository not found", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/settings/repositories/edit/repository/100",
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <Routes>
              <Route
                element={<RepositoryEdit />}
                path="/settings/repositories/edit/:type/:id"
              />
            </Routes>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    // expect(wrapper.find("h4").text()).toBe("Repository not found");
    expect(screen.getByText("Repository not found")).toBeInTheDocument();
  });

  it("can display a repository edit form with correct repo data", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/settings/repositories/edit/repository/1",
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <Routes>
              <Route
                element={<RepositoryEdit />}
                path="/settings/repositories/edit/:type/:id"
              />
            </Routes>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const form = screen.getByRole("form", { name: "Edit repository" });
    expect(form).toBeInTheDocument();
    expect(
      within(form).getByRole("textbox", { name: "Name" })
    ).toBeInTheDocument();
  });
});

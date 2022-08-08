import { screen, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import RepositoryAdd from "./RepositoryAdd";

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

describe("RepositoryAdd", () => {
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
        items: [packageRepositoryFactory()],
      }),
    });
  });

  it("can display a repository add form with type ppa", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories/add/ppa", key: "testKey" },
          ]}
        >
          <CompatRouter>
            <Routes>
              <Route
                element={<RepositoryAdd />}
                path="/settings/repositories/add/:type"
              />
            </Routes>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole("form", { name: "Add PPA" })).toBeInTheDocument();
  });

  it("can display a repository add form with type repository", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/settings/repositories/add/repository",
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <Routes>
              <Route
                element={<RepositoryAdd />}
                path="/settings/repositories/add/:type"
              />
            </Routes>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByRole("form", { name: "Add repository" })
    ).toBeInTheDocument();
  });
});

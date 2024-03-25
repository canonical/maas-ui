import { MemoryRouter } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom";

import RepositoryAdd from "./RepositoryAdd";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithMockStore } from "@/testing/utils";

describe("RepositoryAdd", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      general: factory.generalState({
        componentsToDisable: factory.componentsToDisableState({
          loaded: true,
        }),
        knownArchitectures: factory.knownArchitecturesState({
          loaded: true,
        }),
        pocketsToDisable: factory.pocketsToDisableState({
          loaded: true,
        }),
      }),
      packagerepository: factory.packageRepositoryState({
        loaded: true,
        items: [factory.packageRepository()],
      }),
    });
  });

  it("can display a repository add form with type ppa", () => {
    renderWithMockStore(
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
      </MemoryRouter>,
      { state }
    );

    expect(screen.getByRole("form", { name: "Add PPA" })).toBeInTheDocument();
  });

  it("can display a repository add form with type repository", () => {
    renderWithMockStore(
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
      </MemoryRouter>,
      { state }
    );
    expect(
      screen.getByRole("form", { name: "Add repository" })
    ).toBeInTheDocument();
  });
});

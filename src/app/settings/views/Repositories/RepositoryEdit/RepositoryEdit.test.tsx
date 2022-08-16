import { screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom-v5-compat";

import { Labels as RepositoryFormLabels } from "../RepositoryFormFields/RepositoryFormFields";

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
import { renderWithMockStore } from "testing/utils";

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
    renderWithMockStore(
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
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("handles repository not found", () => {
    renderWithMockStore(
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
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByText("Repository not found")).toBeInTheDocument();
  });

  it("can display a repository edit form with correct repo data", () => {
    renderWithMockStore(
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
      </MemoryRouter>,
      { state }
    );
    const form = screen.getByRole("form", { name: "Edit repository" });
    expect(form).toBeInTheDocument();
    expect(
      within(form).getByRole("textbox", { name: RepositoryFormLabels.Name })
    ).toBeInTheDocument();
  });
});

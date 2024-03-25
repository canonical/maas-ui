import { MemoryRouter } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom";

import { Labels as RepositoryFormLabels } from "../RepositoryFormFields/RepositoryFormFields";

import RepositoryEdit from "./RepositoryEdit";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, within, renderWithMockStore } from "@/testing/utils";

describe("RepositoryEdit", () => {
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
        items: [
          factory.packageRepository({
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

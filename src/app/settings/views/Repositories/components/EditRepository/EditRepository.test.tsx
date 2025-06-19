import { Labels as RepositoryFormLabels } from "../RepositoryFormFields/RepositoryFormFields";

import EditRepository from "./EditRepository";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, within, renderWithProviders } from "@/testing/utils";

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
    renderWithProviders(<EditRepository id={1} type={"ppa"} />, { state });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("handles repository not found", () => {
    renderWithProviders(<EditRepository id={42069} type={"ppa"} />, { state });
    expect(screen.getByText("Repository not found")).toBeInTheDocument();
  });

  it("handles 'type' being undefined", () => {
    renderWithProviders(<EditRepository id={1} type={undefined} />, { state });
    expect(screen.getByText("Repository not found")).toBeInTheDocument();
  });

  it("can display a repository edit form with correct repo data", () => {
    renderWithProviders(<EditRepository id={1} type="ppa" />, { state });
    const form = screen.getByRole("form", { name: "Edit PPA" });
    expect(form).toBeInTheDocument();
    expect(
      within(form).getByRole("textbox", { name: RepositoryFormLabels.Name })
    ).toBeInTheDocument();
  });
});

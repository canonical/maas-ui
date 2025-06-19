import { Labels as RepositoryFormLabels } from "../RepositoryFormFields/RepositoryFormFields";

import EditRepository from "./EditRepository";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { packageRepositoriesResolvers } from "@/testing/resolvers/packageRepositories";
import {
  screen,
  within,
  renderWithProviders,
  setupMockServer,
  mockIsPending,
  waitFor,
  waitForLoading,
} from "@/testing/utils";

const mockServer = setupMockServer(
  packageRepositoriesResolvers.getPackageRepository.handler(
    factory.packageRepository({ id: 1, name: "test" })
  )
);

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
    });
  });

  it("displays a loading component if loading", () => {
    mockIsPending();
    renderWithProviders(<EditRepository id={1} type={"ppa"} />, { state });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows an error message if the repository fetch fails", async () => {
    mockServer.use(
      packageRepositoriesResolvers.getPackageRepository.error({
        message: "Uh oh!",
        code: 500,
      })
    );

    renderWithProviders(<EditRepository id={1} type={"ppa"} />, { state });

    await waitFor(() => {
      expect(screen.getByText("Uh oh!")).toBeInTheDocument();
    });
  });

  it("handles 'type' being undefined", async () => {
    renderWithProviders(<EditRepository id={1} type={undefined} />, { state });

    await waitForLoading();

    expect(screen.getByText("Repository not found")).toBeInTheDocument();
  });

  it("can display a repository edit form with correct repo data", async () => {
    renderWithProviders(<EditRepository id={1} type="ppa" />, { state });

    await waitForLoading();

    const form = screen.getByRole("form", { name: "Edit PPA" });

    expect(form).toBeInTheDocument();
    expect(
      within(form).getByRole("textbox", { name: RepositoryFormLabels.Name })
    ).toBeInTheDocument();
  });
});

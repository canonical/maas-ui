import configureStore from "redux-mock-store";

import { Labels as RepositoryFormLabels } from "../RepositoryFormFields/RepositoryFormFields";

import RepositoryForm from "./RepositoryForm";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { packageRepositoriesResolvers } from "@/testing/resolvers/packageRepositories";
import {
  userEvent,
  screen,
  renderWithProviders,
  setupMockServer,
  waitForLoading,
} from "@/testing/utils";

const mockStore = configureStore();

setupMockServer(
  packageRepositoriesResolvers.createPackageRepository.handler(),
  packageRepositoriesResolvers.updatePackageRepository.handler()
);

describe("RepositoryForm", () => {
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

  it(`dispatches actions to fetch components to disable,
    known architectures and pockets to disable if not already loaded`, () => {
    state.general.componentsToDisable.loaded = false;
    const store = mockStore(state);

    renderWithProviders(<RepositoryForm type="repository" />, { store });

    expect(store.getActions()).toEqual([
      {
        type: "general/fetchComponentsToDisable",
        meta: {
          cache: true,
          model: "general",
          method: "components_to_disable",
        },
        payload: null,
      },
      {
        type: "general/fetchKnownArchitectures",
        meta: {
          cache: true,
          model: "general",
          method: "known_architectures",
        },
        payload: null,
      },
      {
        type: "general/fetchPocketsToDisable",
        meta: {
          cache: true,
          model: "general",
          method: "pockets_to_disable",
        },
        payload: null,
      },
    ]);
  });

  it("shows 'Add PPA' if type is 'ppa' and no repo is provided", async () => {
    renderWithProviders(<RepositoryForm type="ppa" />, { state });

    await waitForLoading();

    expect(screen.getByRole("form", { name: "Add PPA" })).toBeInTheDocument();
  });

  it("shows 'Add repository' if type is 'repository' and no repo is provided", async () => {
    renderWithProviders(<RepositoryForm type="repository" />, { state });

    expect(
      screen.getByRole("form", { name: "Add repository" })
    ).toBeInTheDocument();
  });

  it("shows 'Edit PPA' if type is 'ppa' and a repo is provided", async () => {
    renderWithProviders(
      <RepositoryForm repository={factory.packageRepository()} type="ppa" />,
      { state }
    );

    expect(screen.getByRole("form", { name: "Edit PPA" })).toBeInTheDocument();
  });

  it("shows 'Edit repository' if type is 'repository' and a repo is provided", async () => {
    renderWithProviders(
      <RepositoryForm
        repository={factory.packageRepository()}
        type="repository"
      />,
      { state }
    );

    expect(
      screen.getByRole("form", { name: "Edit repository" })
    ).toBeInTheDocument();
  });

  it("can update a repository", async () => {
    const repository = {
      id: 9,
      created: factory.timestamp("Tue, 27 Aug. 2019 12:39:12"),
      updated: factory.timestamp("Tue, 27 Aug. 2019 12:39:12"),
      name: "name",
      url: "http://www.website.com",
      distributions: [],
      disabled_pockets: [],
      disabled_components: [],
      disable_sources: false,
      components: [],
      arches: ["i386", "amd64"],
      key: "",
      default: false,
      enabled: true,
    };
    renderWithProviders(
      <RepositoryForm repository={repository} type="repository" />,
      { state }
    );

    await userEvent.clear(
      screen.getByRole("textbox", { name: RepositoryFormLabels.Name })
    );
    await userEvent.clear(
      screen.getByRole("textbox", { name: RepositoryFormLabels.URL })
    );
    await userEvent.clear(
      screen.getByRole("textbox", { name: RepositoryFormLabels.Key })
    );
    await userEvent.clear(
      screen.getByRole("textbox", { name: RepositoryFormLabels.Distributions })
    );
    await userEvent.clear(
      screen.getByRole("textbox", { name: RepositoryFormLabels.Components })
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: RepositoryFormLabels.Name }),
      "newName"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: RepositoryFormLabels.URL }),
      "http://www.website.com"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Save repository" })
    );

    expect(packageRepositoriesResolvers.updatePackageRepository.resolved).toBe(
      true
    );
  });

  it("can create a repository", async () => {
    renderWithProviders(<RepositoryForm type="repository" />, { state });

    await userEvent.type(
      screen.getByRole("textbox", { name: RepositoryFormLabels.Name }),
      "newName"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: RepositoryFormLabels.URL }),
      "http://www.website.com"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Save repository" })
    );

    expect(packageRepositoriesResolvers.createPackageRepository.resolved).toBe(
      true
    );
  });
});

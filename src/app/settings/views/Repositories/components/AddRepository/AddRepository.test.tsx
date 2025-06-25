import configureStore from "redux-mock-store";
import type { Mock } from "vitest";

import { Labels as RepositoryFormLabels } from "../RepositoryFormFields/RepositoryFormFields";

import AddRepository from "./AddRepository";

import { useSidePanel } from "@/app/base/side-panel-context";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { packageRepositoriesResolvers } from "@/testing/resolvers/packageRepositories";
import {
  userEvent,
  screen,
  renderWithProviders,
  setupMockServer,
  waitForLoading,
  waitFor,
} from "@/testing/utils";

const mockStore = configureStore();

setupMockServer(
  packageRepositoriesResolvers.createPackageRepository.handler(),
  packageRepositoriesResolvers.updatePackageRepository.handler()
);

vi.mock("@/app/base/side-panel-context", async () => {
  const actual = await vi.importActual("@/app/base/side-panel-context");
  return {
    ...actual,
    useSidePanel: vi.fn(),
  };
});

describe("AddRepository", () => {
  let state: RootState;

  const mockSetSidePanelContent = vi.fn();

  (useSidePanel as Mock).mockReturnValue({
    setSidePanelContent: mockSetSidePanelContent,
  });

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

    renderWithProviders(<AddRepository type="repository" />, { store });

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

  it("shows 'Add PPA' if type is 'ppa'", async () => {
    renderWithProviders(<AddRepository type="ppa" />, { state });

    await waitForLoading();

    expect(screen.getByRole("form", { name: "Add PPA" })).toBeInTheDocument();
  });

  it("shows 'Add repository' if type is 'repository'", async () => {
    renderWithProviders(<AddRepository type="repository" />, { state });

    expect(
      screen.getByRole("form", { name: "Add repository" })
    ).toBeInTheDocument();
  });

  it("can create a repository", async () => {
    renderWithProviders(<AddRepository type="repository" />, { state });

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

  it("closes the side panel on cancel", async () => {
    renderWithProviders(<AddRepository type="ppa" />, { state });

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(mockSetSidePanelContent).toHaveBeenCalledWith(null);
    });
  });
});

import type { RepositorySidePanelContent } from "../../constants";
import { RepositoryActionSidePanelViews } from "../../constants";
import { Labels as RepositoryFormLabels } from "../RepositoryFormFields/RepositoryFormFields";

import RepositoryEdit from "./RepositoryEdit";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, within, renderWithProviders } from "@/testing/utils";

let mockSidePanelContent: RepositorySidePanelContent | null = null;

vi.mock("@/app/base/side-panel-context", async () => {
  const actual = await vi.importActual("@/app/base/side-panel-context");
  return {
    ...actual,
    useSidePanel: () => ({
      sidePanelContent: mockSidePanelContent,
      setSidePanelContent: vi.fn(),
      sidePanelSize: "regular",
      setSidePanelSize: vi.fn(),
    }),
  };
});

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
    renderWithProviders(<RepositoryEdit />, { state });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("handles repository not found", () => {
    mockSidePanelContent = {
      view: RepositoryActionSidePanelViews.EDIT_REPOSITORY,
      extras: {
        repositoryId: 42069,
        type: "repository",
      },
    };
    renderWithProviders(<RepositoryEdit />, { state });
    expect(screen.getByText("Repository not found")).toBeInTheDocument();
  });

  it("can display a repository edit form with correct repo data", () => {
    mockSidePanelContent = {
      view: RepositoryActionSidePanelViews.EDIT_REPOSITORY,
      extras: {
        repositoryId: 1,
        type: "repository",
      },
    };
    renderWithProviders(<RepositoryEdit />, { state });
    const form = screen.getByRole("form", { name: "Edit repository" });
    expect(form).toBeInTheDocument();
    expect(
      within(form).getByRole("textbox", { name: RepositoryFormLabels.Name })
    ).toBeInTheDocument();
  });
});

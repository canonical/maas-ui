import configureStore from "redux-mock-store";

import type { RepositorySidePanelContent } from "../../constants";
import { RepositoryActionSidePanelViews } from "../../constants";

import RepositoryDelete from "./DeleteRepository";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithProviders, userEvent } from "@/testing/utils";

const mockStore = configureStore();
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

describe("RepositoryDelete", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      packagerepository: factory.packageRepositoryState({
        loaded: true,
        items: [
          factory.packageRepository({
            id: 1,
            name: "main_archive",
            url: "http://archive.ubuntu.com/ubuntu",
            default: true,
            enabled: true,
          }),
        ],
      }),
    });
  });

  it("displays a message if the repository ID is not provided", () => {
    mockSidePanelContent = {
      view: RepositoryActionSidePanelViews.DELETE_REPOSITORY,
    };

    renderWithProviders(<RepositoryDelete />, { state });

    expect(
      screen.getByText("A package repository with this ID could not be found.")
    ).toBeInTheDocument();
  });

  it("renders correctly when an ID is provided", async () => {
    mockSidePanelContent = {
      view: RepositoryActionSidePanelViews.DELETE_REPOSITORY,
      extras: {
        repositoryId: 1,
      },
    };

    renderWithProviders(<RepositoryDelete />);

    expect(
      screen.getByRole("form", { name: "Confirm repository deletion" })
    ).toBeInTheDocument();
  });

  it("can delete a repository", async () => {
    mockSidePanelContent = {
      view: RepositoryActionSidePanelViews.DELETE_REPOSITORY,
      extras: {
        repositoryId: 1,
      },
    };

    const store = mockStore(state);

    renderWithProviders(<RepositoryDelete />, { store });

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(store.getActions()[0]).toEqual({
      type: "packagerepository/delete",
      payload: {
        params: {
          id: 1,
        },
      },
      meta: {
        model: "packagerepository",
        method: "delete",
      },
    });
  });
});

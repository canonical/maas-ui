import configureStore from "redux-mock-store";

import type { RepositorySidePanelContent } from "../constants";
import { RepositoryActionSidePanelViews } from "../constants";

import RepositoriesList from "./RepositoriesList";

import { rootState } from "@/testing/factories";
import { packageRepositoriesResolvers } from "@/testing/resolvers/packageRepositories";
import { renderWithProviders, screen, setupMockServer } from "@/testing/utils";

setupMockServer(packageRepositoriesResolvers.listPackageRepositories.handler());

const mockStore = configureStore();
const state = rootState();

let mockSidePanelContent: RepositorySidePanelContent | null = null;
const mockSetSidePanelContent = vi.fn();

vi.mock("@/app/base/side-panel-context", async () => {
  const actual = await vi.importActual("@/app/base/side-panel-context");
  return {
    ...actual,
    useSidePanel: () => ({
      sidePanelContent: mockSidePanelContent,
      setSidePanelContent: mockSetSidePanelContent,
      sidePanelSize: "regular",
      setSidePanelSize: vi.fn(),
    }),
  };
});

describe("RepositoriesList", () => {
  beforeEach(() => {
    mockSetSidePanelContent.mockClear();
    mockSidePanelContent = null;
  });

  it("renders 'Add PPA' when view is ADD_PPA", async () => {
    mockSidePanelContent = {
      view: RepositoryActionSidePanelViews.ADD_PPA,
    };

    renderWithProviders(<RepositoriesList />);

    expect(
      screen.getByRole("complementary", { name: "Add PPA" })
    ).toBeInTheDocument();
  });

  it("renders 'Add repository' when view is ADD_REPOSITORY", async () => {
    mockSidePanelContent = {
      view: RepositoryActionSidePanelViews.ADD_REPOSITORY,
    };

    renderWithProviders(<RepositoriesList />);

    expect(
      screen.getByRole("complementary", { name: "Add repository" })
    ).toBeInTheDocument();
  });

  it("renders 'Edit repository' when view is EDIT_REPOSITORY", async () => {
    mockSidePanelContent = {
      view: RepositoryActionSidePanelViews.EDIT_REPOSITORY,
    };

    renderWithProviders(<RepositoriesList />);

    expect(
      screen.getByRole("complementary", { name: "Edit repository" })
    ).toBeInTheDocument();
  });

  it("renders 'Delete repository' when view is DELETE_REPOSITORY", async () => {
    mockSidePanelContent = {
      view: RepositoryActionSidePanelViews.DELETE_REPOSITORY,
    };

    renderWithProviders(<RepositoriesList />);

    expect(
      screen.getByRole("complementary", { name: "Delete repository" })
    ).toBeInTheDocument();
  });
});

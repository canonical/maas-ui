import type { Mock } from "vitest";

import DeleteRepository from "./DeleteRepository";

import { useSidePanel } from "@/app/base/side-panel-context";
import { packageRepositoriesResolvers } from "@/testing/resolvers/packageRepositories";
import {
  screen,
  renderWithProviders,
  userEvent,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  packageRepositoriesResolvers.deletePackageRepository.handler()
);

vi.mock("@/app/base/side-panel-context", async () => {
  const actual = await vi.importActual("@/app/base/side-panel-context");
  return {
    ...actual,
    useSidePanel: vi.fn(),
  };
});

describe("RepositoryDelete", () => {
  const mockSetSidePanelContent = vi.fn();

  (useSidePanel as Mock).mockReturnValue({
    setSidePanelContent: mockSetSidePanelContent,
  });
  it("renders", async () => {
    renderWithProviders(<DeleteRepository id={1} />);

    expect(
      screen.getByRole("form", { name: "Confirm repository deletion" })
    ).toBeInTheDocument();
  });

  it("can delete a repository and close the side panel", async () => {
    renderWithProviders(<DeleteRepository id={1} />);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(
        packageRepositoriesResolvers.deletePackageRepository.resolved
      ).toBe(true);
    });
  });

  it("shows errors on submission", async () => {
    mockServer.use(
      packageRepositoriesResolvers.deletePackageRepository.error()
    );

    renderWithProviders(<DeleteRepository id={1} />);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(screen.getByText(/Error/)).toBeInTheDocument();
    });
  });
});

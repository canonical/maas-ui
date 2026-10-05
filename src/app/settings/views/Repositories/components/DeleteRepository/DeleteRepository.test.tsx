import DeleteRepository from "./DeleteRepository";

import { packageRepositoriesResolvers } from "@/testing/resolvers/packageRepositories";
import {
  screen,
  renderWithProviders,
  userEvent,
  setupMockServer,
  waitFor,
  waitForLoading,
  mockModal,
} from "@/testing/utils";

const { mockClose } = await mockModal();

const mockServer = setupMockServer(
  packageRepositoriesResolvers.getPackageRepository.handler(),
  packageRepositoriesResolvers.deletePackageRepository.handler()
);

describe("RepositoryDelete", () => {
  it("runs closeModal function when the cancel button is clicked", async () => {
    renderWithProviders(<DeleteRepository id={1} />);
    await waitForLoading();
    await userEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockClose).toHaveBeenCalled();
  });

  it("can delete a repository and close the modal", async () => {
    renderWithProviders(<DeleteRepository id={1} />);
    await waitForLoading();
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await waitFor(() => {
      expect(
        packageRepositoriesResolvers.deletePackageRepository.resolved
      ).toBe(true);
    });
    await waitFor(() => {
      expect(mockClose).toHaveBeenCalled();
    });
  });

  it("shows errors on submission", async () => {
    mockServer.use(
      packageRepositoriesResolvers.deletePackageRepository.error()
    );
    renderWithProviders(<DeleteRepository id={1} />);
    await waitForLoading();
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await waitFor(() => {
      expect(screen.getByText(/Error/)).toBeInTheDocument();
    });
  });
});

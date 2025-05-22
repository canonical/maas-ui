import { vi } from "vitest";

import DeletePool from "./DeletePool";

import { poolsResolvers } from "@/testing/resolvers/pools";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(poolsResolvers.deletePool.handler());

describe("DeletePool", () => {
  it("calls closeForm on cancel click", async () => {
    const closeForm = vi.fn();
    renderWithProviders(<DeletePool closeForm={closeForm} id={2} />);

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(closeForm).toHaveBeenCalled();
  });

  it("calls delete pool on save click", async () => {
    renderWithProviders(<DeletePool closeForm={vi.fn()} id={2} />);

    await userEvent.click(screen.getByRole("button", { name: /Delete/i }));

    await waitFor(() => {
      expect(poolsResolvers.deletePool.resolved).toBeTruthy();
    });
  });

  it("displays error messages when delete pool fails", async () => {
    mockServer.use(
      poolsResolvers.deletePool.error({ code: 400, message: "Uh oh!" })
    );

    renderWithProviders(<DeletePool closeForm={vi.fn()} id={2} />);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(screen.getByText(/Uh oh!/i)).toBeInTheDocument();
    });
  });
});

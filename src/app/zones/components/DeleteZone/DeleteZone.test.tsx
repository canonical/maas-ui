import { vi } from "vitest";

import DeleteZone from "./DeleteZone";

import { zoneResolvers } from "@/testing/resolvers/zones";
import {
  userEvent,
  screen,
  setupMockServer,
  waitFor,
  renderWithProviders,
} from "@/testing/utils";

const mockServer = setupMockServer(zoneResolvers.deleteZone.handler());

describe("DeleteZone", () => {
  it("calls closeForm on cancel click", async () => {
    const closeForm = vi.fn();
    renderWithProviders(<DeleteZone closeForm={closeForm} id={2} />);

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(closeForm).toHaveBeenCalled();
  });

  it("calls delete zone on save click", async () => {
    renderWithProviders(<DeleteZone closeForm={vi.fn()} id={2} />);

    await userEvent.click(screen.getByRole("button", { name: /Delete/i }));

    await waitFor(() => {
      expect(zoneResolvers.deleteZone.resolved).toBeTruthy();
    });
  });

  it("displays error messages when delete zone fails", async () => {
    mockServer.use(
      zoneResolvers.deleteZone.error({ code: 400, message: "Uh oh!" })
    );

    renderWithProviders(<DeleteZone closeForm={vi.fn()} id={2} />);

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(screen.getByText(/Uh oh!/i)).toBeInTheDocument();
    });
  });
});

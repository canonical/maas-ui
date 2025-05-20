import { waitFor } from "@testing-library/react";
import { vi } from "vitest";

import AddPool from "./AddPool";

import { poolsResolvers } from "@/testing/resolvers/pools";
import {
  screen,
  renderWithProviders,
  userEvent,
  setupMockServer,
} from "@/testing/utils";

const mockServer = setupMockServer(poolsResolvers.createPool.handler());

describe("AddPool", () => {
  it("runs closeForm function when the cancel button is clicked", async () => {
    const closeForm = vi.fn();
    renderWithProviders(<AddPool closeForm={closeForm} />);

    await userEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(closeForm).toHaveBeenCalled();
  });

  it("calls create pool on save click", async () => {
    renderWithProviders(<AddPool closeForm={vi.fn()} />);

    await userEvent.type(
      screen.getByRole("textbox", { name: /name/i }),
      "test-pool"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /description/i }),
      "desc"
    );

    await userEvent.click(screen.getByRole("button", { name: /Save pool/i }));

    await waitFor(() => {
      expect(poolsResolvers.createPool.resolved).toBeTruthy();
    });
  });

  it("displays error message when create pool fails", async () => {
    mockServer.use(
      poolsResolvers.createPool.error({ code: 400, message: "Uh oh!" })
    );

    renderWithProviders(<AddPool closeForm={vi.fn()} />);

    await userEvent.type(
      screen.getByRole("textbox", { name: /name/i }),
      "danger-zone"
    );

    await userEvent.click(screen.getByRole("button", { name: /Save pool/i }));

    await waitFor(() => {
      expect(screen.getByText(/Uh oh!/i)).toBeInTheDocument();
    });
  });
});

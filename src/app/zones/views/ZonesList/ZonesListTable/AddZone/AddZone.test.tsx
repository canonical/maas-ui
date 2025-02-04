import { vi } from "vitest";

import AddZone from "./AddZone";

import { zoneResolvers } from "@/testing/resolvers/zones";
import {
  userEvent,
  screen,
  setupMockServer,
  renderWithProviders,
  waitFor,
} from "@/testing/utils";

setupMockServer(zoneResolvers.createZone.handler());

describe("AddZone", () => {
  it("runs closeForm function when the cancel button is clicked", async () => {
    const closeForm = vi.fn();
    renderWithProviders(<AddZone closeForm={closeForm} />);

    await userEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(closeForm).toHaveBeenCalled();
  });

  it("calls create zone on save click", async () => {
    renderWithProviders(<AddZone closeForm={vi.fn()} />);

    await userEvent.type(
      screen.getByRole("textbox", { name: /name/i }),
      "test-zone"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /description/i }),
      "desc"
    );

    await userEvent.click(screen.getByRole("button", { name: /Add AZ/i }));

    await waitFor(() => expect(zoneResolvers.createZone.resolved).toBeTruthy());
  });
});

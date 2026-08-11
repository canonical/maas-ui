import SwitchDetails from "./SwitchDetails";

import { mockSwitches, switchResolvers } from "@/testing/resolvers/switches";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(switchResolvers.getSwitch.handler());

describe("SwitchDetails", () => {
  it("displays the switch name once loaded", async () => {
    const switchItem = mockSwitches.items[0];
    renderWithProviders(<SwitchDetails />, {
      initialEntries: [`/switches/${switchItem.id}/summary`],
      pattern: "/switches/:id/*",
    });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: switchItem.name })
      ).toBeInTheDocument();
    });
  });

  it("displays a not found message for an invalid id", () => {
    renderWithProviders(<SwitchDetails />, {
      initialEntries: ["/switches/invalid/summary"],
      pattern: "/switches/:id/*",
    });

    expect(screen.getByText(/switch not found/i)).toBeInTheDocument();
  });
});

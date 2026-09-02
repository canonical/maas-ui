import ZonesListHeader from "./ZonesListHeader";

import { authResolvers } from "@/testing/resolvers/auth";
import {
  userEvent,
  screen,
  renderWithProviders,
  mockSidePanel,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);
const { mockOpen } = await mockSidePanel();

describe("ZonesListHeader", () => {
  it("displays the form when Add AZ is clicked", async () => {
    renderWithProviders(<ZonesListHeader />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add AZ" })
      ).not.toBeAriaDisabled();
    });

    await userEvent.click(screen.getByRole("button", { name: "Add AZ" }));

    expect(mockOpen).toHaveBeenCalled();
  });

  it("disables the Add AZ button without permissions", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(<ZonesListHeader />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Add AZ" })).toBeAriaDisabled();
    });

    await userEvent.click(screen.getByRole("button", { name: "Add AZ" }));

    expect(mockOpen).not.toHaveBeenCalled();
  });
});

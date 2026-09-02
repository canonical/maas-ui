import PoolsListHeader from "@/app/pools/components/PoolsListHeader/PoolsListHeader";
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

describe("PoolsListHeader", () => {
  it("displays the form when Add pool is clicked", async () => {
    renderWithProviders(<PoolsListHeader />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add pool" })
      ).not.toBeAriaDisabled();
    });

    await userEvent.click(screen.getByRole("button", { name: "Add pool" }));

    expect(mockOpen).toHaveBeenCalled();
  });

  it("disables the Add pool button without the edit entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(<PoolsListHeader />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add pool" })
      ).toBeAriaDisabled();
    });

    await userEvent.click(screen.getByRole("button", { name: "Add pool" }));

    expect(mockOpen).not.toHaveBeenCalled();
  });
});

import { waitFor } from "@testing-library/react";

import DeleteZone from "@/app/zones/components/DeleteZone";
import ZonesList from "@/app/zones/views/ZonesList";
import { authResolvers } from "@/testing/resolvers/auth";
import { zoneResolvers } from "@/testing/resolvers/zones";
import {
  mockModal,
  renderWithProviders,
  screen,
  userEvent,
  setupMockServer,
} from "@/testing/utils";

setupMockServer(
  zoneResolvers.listZones.handler(),
  zoneResolvers.listZonesWithStatistics.handler(),
  zoneResolvers.getZone.handler(),
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);
const { mockOpen: mockOpenModal } = await mockModal();

describe("ZonesList", () => {
  it("renders AddZone", async () => {
    renderWithProviders(<ZonesList />);
    await userEvent.click(screen.getByRole("button", { name: "Add AZ" }));
    expect(
      screen.getByRole("complementary", { name: "Add AZ" })
    ).toBeInTheDocument();
  });

  it("renders EditZone when a valid zoneId is provided", async () => {
    renderWithProviders(<ZonesList />);
    await waitFor(() => {
      expect(screen.getAllByRole("button", { name: "Edit" }));
    });
    await userEvent.click(screen.getAllByRole("button", { name: "Edit" })[0]);
    expect(
      screen.getByRole("complementary", { name: "Edit AZ" })
    ).toBeInTheDocument();
  });

  it("renders DeleteZone when a valid zoneId is provided", async () => {
    renderWithProviders(<ZonesList />, { state: {} });
    await waitFor(() => {
      expect(screen.getAllByRole("button", { name: "Delete" }));
    });
    // Cannot delete default zone at index 0, therefore, check index 1
    await userEvent.click(screen.getAllByRole("button", { name: "Delete" })[1]);
    expect(mockOpenModal).toHaveBeenCalledWith(
      expect.objectContaining({
        component: DeleteZone,
        title: "Delete AZ",
      })
    );
  });

  it("closes side panel form when canceled", async () => {
    renderWithProviders(<ZonesList />);
    await userEvent.click(screen.getByRole("button", { name: "Add AZ" }));
    expect(
      screen.getByRole("complementary", { name: "Add AZ" })
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(
      screen.queryByRole("complementary", { name: "Add AZ" })
    ).not.toBeInTheDocument();
  });
});

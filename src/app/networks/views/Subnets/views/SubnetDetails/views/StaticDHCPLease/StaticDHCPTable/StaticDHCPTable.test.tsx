import DeleteDHCPLease from "../DeleteDHCPLease";
import ReserveDHCPLease from "../ReserveDHCPLease";

import StaticDHCPTable from "./StaticDHCPTable";

import { reservedIp } from "@/testing/factories/reservedip";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);
const { mockOpen } = await mockSidePanel();

describe("StaticDHCPTable", () => {
  it("renders a loading component if table items are loading", async () => {
    renderWithProviders(
      <StaticDHCPTable loading={true} reservedIps={[]} subnetId={0} />
    );
    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  it("renders a message when table is empty", async () => {
    renderWithProviders(
      <StaticDHCPTable loading={false} reservedIps={[]} subnetId={0} />
    );
    await waitFor(() => {
      expect(
        screen.getByText("No static DHCP leases available.")
      ).toBeInTheDocument();
    });
  });

  it("renders the columns correctly", async () => {
    renderWithProviders(
      <StaticDHCPTable loading={false} reservedIps={[]} subnetId={0} />
    );
    [
      "IP Address",
      "MAC Address",
      "Node",
      "Interface",
      "Usage",
      "Comment",
      "Actions",
    ].forEach((column) => {
      expect(
        screen.getByRole("columnheader", {
          name: new RegExp(`^${column}`, "i"),
        })
      ).toBeInTheDocument();
    });
  });

  it("opens the side panel with the correct view when the edit button is clicked", async () => {
    const reservedIps = [reservedIp()];
    renderWithProviders(
      <StaticDHCPTable loading={false} reservedIps={reservedIps} subnetId={0} />
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Edit" })
      ).not.toBeAriaDisabled();
    });
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));

    expect(mockOpen).toHaveBeenCalledWith({
      component: ReserveDHCPLease,
      title: "Edit DHCP lease",
      props: {
        reservedIpId: reservedIps[0].id,
        subnetId: 0,
      },
    });
  });

  it("opens the side panel with the correct view when the delete button is clicked", async () => {
    const reservedIps = [reservedIp()];
    renderWithProviders(
      <StaticDHCPTable loading={false} reservedIps={reservedIps} subnetId={0} />
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Delete" })
      ).not.toBeAriaDisabled();
    });
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(mockOpen).toHaveBeenCalledWith({
      component: DeleteDHCPLease,
      title: "Delete DHCP lease",
      props: {
        reservedIpId: reservedIps[0].id,
      },
    });
  });

  it("disables the table actions without the edit entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    const reservedIps = [reservedIp()];
    renderWithProviders(
      <StaticDHCPTable loading={false} reservedIps={reservedIps} subnetId={0} />
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Edit" })).toBeAriaDisabled();
    });
    expect(screen.getByRole("button", { name: "Delete" })).toBeAriaDisabled();
  });
});

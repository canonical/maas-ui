import StaticDHCPTable from "./StaticDHCPTable";

import { staticDHCPLease } from "@/testing/factories/subnet";
import { renderWithBrowserRouter, screen } from "@/testing/utils";

it("renders a static DHCP table with no data", () => {
  renderWithBrowserRouter(<StaticDHCPTable staticDHCPLeases={[]} />);

  expect(
    screen.getByRole("table", { name: "Static DHCP leases" })
  ).toBeInTheDocument();
  expect(
    screen.getByText("No static DHCP leases available")
  ).toBeInTheDocument();
});

it("renders a static DHCP table when data is provided", () => {
  const dhcpLeases = [staticDHCPLease(), staticDHCPLease()];
  renderWithBrowserRouter(<StaticDHCPTable staticDHCPLeases={dhcpLeases} />);

  expect(
    screen.getByRole("table", { name: "Static DHCP leases" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("cell", { name: dhcpLeases[0].ip_address })
  ).toBeInTheDocument();
});

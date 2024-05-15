import StaticDHCPTable from "./StaticDHCPTable";

import { reservedIp } from "@/testing/factories/reservedip";
import { renderWithBrowserRouter, screen } from "@/testing/utils";

it("renders a static DHCP table with no data", () => {
  renderWithBrowserRouter(<StaticDHCPTable loading={false} reservedIps={[]} />);

  expect(
    screen.getByRole("table", { name: "Static DHCP leases" })
  ).toBeInTheDocument();
  expect(
    screen.getByText("No static DHCP leases available")
  ).toBeInTheDocument();
});

it("renders a static DHCP table when data is provided", () => {
  const reservedIps = [reservedIp(), reservedIp()];
  renderWithBrowserRouter(
    <StaticDHCPTable loading={false} reservedIps={reservedIps} />
  );

  expect(
    screen.getByRole("table", { name: "Static DHCP leases" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("cell", { name: reservedIps[0].ip })
  ).toBeInTheDocument();
});

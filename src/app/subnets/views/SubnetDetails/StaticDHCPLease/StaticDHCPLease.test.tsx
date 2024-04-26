import StaticDHCPLease from "./StaticDHCPLease";

import { renderWithBrowserRouter, screen } from "@/testing/utils";

it("renders", () => {
  renderWithBrowserRouter(<StaticDHCPLease subnetId={1} />);
  expect(
    screen.getByRole("heading", { name: "Static DHCP leases" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Reserve static DHCP lease" })
  ).toBeInTheDocument();
});

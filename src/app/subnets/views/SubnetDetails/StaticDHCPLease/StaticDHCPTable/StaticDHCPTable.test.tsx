import StaticDHCPTable from "./StaticDHCPTable";

import * as sidePanelHooks from "@/app/base/side-panel-context";
import { SubnetActionTypes } from "@/app/subnets/views/SubnetDetails/constants";
import { reservedIp } from "@/testing/factories/reservedip";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const setSidePanelContent = vi.fn();
beforeAll(() => {
  vi.spyOn(sidePanelHooks, "useSidePanel").mockReturnValue({
    setSidePanelContent,
    sidePanelContent: null,
    setSidePanelSize: vi.fn(),
    sidePanelSize: "regular",
  });
});

describe("StaticDHCPTable", () => {
  it("renders a static DHCP table with no data", () => {
    renderWithBrowserRouter(
      <StaticDHCPTable loading={false} reservedIps={[]} />
    );
    expect(
      screen.getByRole("table", { name: "Static DHCP leases" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("No static DHCP leases available")
    ).toBeInTheDocument();
  });

  it("renders a static DHCP table with the right action buttons when data is provided", () => {
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
    expect(screen.getAllByRole("button", { name: "Edit" }).length).toBe(2);
    expect(screen.getAllByRole("button", { name: "Delete" }).length).toBe(2);
  });

  it("opens the side panel with the correct view when the edit button is clicked", async () => {
    const reservedIps = [reservedIp()];
    renderWithBrowserRouter(
      <StaticDHCPTable loading={false} reservedIps={reservedIps} />
    );

    await userEvent.click(screen.getByRole("button", { name: "Edit" }));

    expect(setSidePanelContent).toHaveBeenCalledWith({
      extras: { reservedIpId: reservedIps[0].id },
      view: ["", SubnetActionTypes.ReserveDHCPLease],
    });
  });

  it("opens the side panel with the correct view when the delete button is clicked", async () => {
    const reservedIps = [reservedIp()];
    renderWithBrowserRouter(
      <StaticDHCPTable loading={false} reservedIps={reservedIps} />
    );

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(setSidePanelContent).toHaveBeenCalledWith({
      extras: { reservedIpId: reservedIps[0].id },
      view: ["", SubnetActionTypes.DeleteDHCPLease],
    });
  });
});

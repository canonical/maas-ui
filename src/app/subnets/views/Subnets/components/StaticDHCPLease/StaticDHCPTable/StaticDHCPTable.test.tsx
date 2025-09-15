import StaticDHCPTable from "./StaticDHCPTable";

import * as sidePanelHooks from "@/app/base/side-panel-context";
import { SubnetActionTypes } from "@/app/subnets/views/Subnets/views/constants";
import { reservedIp } from "@/testing/factories/reservedip";
import {
  renderWithProviders,
  screen,
  userEvent,
  waitFor,
} from "@/testing/utils";

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
  it("renders a loading component if table items are loading", async () => {
    renderWithProviders(<StaticDHCPTable loading={true} reservedIps={[]} />);
    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  it("renders a message when table is empty", async () => {
    renderWithProviders(<StaticDHCPTable loading={false} reservedIps={[]} />);
    await waitFor(() => {
      expect(
        screen.getByText("No static DHCP leases available")
      ).toBeInTheDocument();
    });
  });

  it("renders the columns correctly", async () => {
    renderWithProviders(<StaticDHCPTable loading={false} reservedIps={[]} />);
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
    renderWithProviders(
      <StaticDHCPTable loading={false} reservedIps={reservedIps} />
    );

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(setSidePanelContent).toHaveBeenCalledWith({
      extras: { reservedIpId: reservedIps[0].id },
      view: ["", SubnetActionTypes.DeleteDHCPLease],
    });
  });
});

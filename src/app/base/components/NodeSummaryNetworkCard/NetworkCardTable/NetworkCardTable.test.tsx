import NetworkCardTable from "./NetworkCardTable";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  screen,
  renderWithBrowserRouter,
  userEvent,
  within,
} from "@/testing/utils";
describe("NetworkCardInterface", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      device: factory.deviceState(),
    });
  });

  it("can render the interface's fabric name", () => {
    state.fabric.items = [factory.fabric({ id: 1, name: "fabric-name" })];
    state.vlan.items = [factory.vlan({ fabric: 1, id: 2 })];
    const iface = factory.machineInterface({ vlan_id: 2 });
    renderWithBrowserRouter(
      <NetworkCardTable interfaces={[iface]} node={state.device.items[0]} />,
      { state }
    );

    expect(
      screen.getByRole("gridcell", { name: /fabric-name/ })
    ).toBeInTheDocument();
  });

  it("formats link speed in Gbps if above 1000 Mbps", () => {
    const iface = factory.machineInterface({ link_speed: 10000 });
    renderWithBrowserRouter(
      <NetworkCardTable interfaces={[iface]} node={state.device.items[0]} />,
      { route: "/machines/abc123/summary", state }
    );
    expect(
      screen.getByRole("gridcell", { name: "10 Gbps" })
    ).toBeInTheDocument();
  });

  describe("DHCP status", () => {
    it("can show external DHCP", () => {
      state.vlan.items = [
        factory.vlan({ external_dhcp: "192.168.1.1", id: 1 }),
      ];
      const iface = factory.machineInterface({ vlan_id: 1 });
      renderWithBrowserRouter(
        <NetworkCardTable interfaces={[iface]} node={state.device.items[0]} />,
        { state }
      );

      expect(
        screen.getByRole("gridcell", { name: "External (192.168.1.1)" })
      ).toBeInTheDocument();
    });

    it("can show MAAS-provided DHCP", () => {
      state.vlan.items = [factory.vlan({ dhcp_on: true, id: 1 })];
      const iface = factory.machineInterface({ vlan_id: 1 });
      renderWithBrowserRouter(
        <NetworkCardTable interfaces={[iface]} node={state.device.items[0]} />,
        { state }
      );

      expect(
        screen.getByRole("gridcell", { name: "MAAS-provided" })
      ).toBeInTheDocument();
    });

    it("can show DHCP relay information with a tooltip", async () => {
      state.fabric.items = [factory.fabric({ id: 1, name: "fabrice" })];
      state.vlan.items = [
        factory.vlan({ id: 2, name: "flan-vlan", relay_vlan: 3 }),
        factory.vlan({ fabric: 1, id: 3, vid: 99, name: "" }),
      ];
      const iface = factory.machineInterface({ vlan_id: 2 });
      renderWithBrowserRouter(
        <NetworkCardTable interfaces={[iface]} node={state.device.items[0]} />,
        { state }
      );

      expect(
        screen.getByRole("gridcell", { name: /Relayed/i })
      ).toBeInTheDocument();

      await userEvent.click(
        within(screen.getByRole("gridcell", { name: /Relayed/i })).getByRole(
          "button",
          { name: "information" }
        )
      );
      expect(
        screen.getByRole("tooltip", { name: "Relayed via fabrice.99" })
      ).toBeInTheDocument();
    });

    it("can show if interface has no DHCP", () => {
      state.vlan.items = [factory.vlan({ id: 1 })];
      const iface = factory.machineInterface({ vlan_id: 1 });
      renderWithBrowserRouter(
        <NetworkCardTable interfaces={[iface]} node={state.device.items[0]} />,
        { state }
      );

      expect(
        screen.getByRole("gridcell", { name: "No DHCP" })
      ).toBeInTheDocument();
    });
  });

  it("can show if the interface is SR-IOV enabled", () => {
    const iface = factory.machineInterface({ sriov_max_vf: 256 });
    renderWithBrowserRouter(
      <NetworkCardTable interfaces={[iface]} node={state.device.items[0]} />,
      { state }
    );

    expect(screen.getByRole("gridcell", { name: "Yes" })).toBeInTheDocument();
  });
});

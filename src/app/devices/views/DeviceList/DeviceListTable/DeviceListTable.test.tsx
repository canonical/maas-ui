import DeviceListTable from "./DeviceListTable";

import urls from "app/base/urls";
import type { Device } from "app/store/device/types";
import { DeviceIpAssignment } from "app/store/device/types";
import type { RootState } from "app/store/root/types";
import {
  device as deviceFactory,
  deviceState as deviceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

describe("DeviceListTable", () => {
  let device: Device;
  let state: RootState;

  beforeEach(() => {
    device = deviceFactory({
      domain: { id: 1, name: "domain" },
      fqdn: "device.domain",
      hostname: "device",
      ip_address: "192.168.1.1",
      ip_assignment: DeviceIpAssignment.STATIC,
      owner: "owner",
      primary_mac: "11:22:33:44:55:66",
      system_id: "abc123",
      tags: [1, 2],
      zone: { id: 2, name: "zone" },
    });
    state = rootStateFactory({
      device: deviceStateFactory({ items: [device] }),
    });
  });

  it("links to a device's details page", () => {
    device.system_id = "def456";
    renderWithBrowserRouter(
      <DeviceListTable
        devices={[device]}
        onSelectedChange={jest.fn()}
        selectedIDs={[]}
      />,
      { state }
    );

    expect(screen.getAllByTestId("device-details-link")[0]).toHaveAttribute(
      "href",
      urls.devices.device.index({ id: device.system_id })
    );
  });

  it("can show when a device has more than one mac address", () => {
    device.primary_mac = "11:11:11:11:11:11";
    device.extra_macs = ["22:22:22:22:22:22", "33:33:33:33:33:33"];
    renderWithBrowserRouter(
      <DeviceListTable
        devices={[device]}
        onSelectedChange={jest.fn()}
        selectedIDs={[]}
      />,
      { state }
    );

    expect(screen.getAllByTestId("mac-display")[0]).toHaveTextContent(
      "11:11:11:11:11:11 (+2)"
    );
  });

  it("links to a device's zone's details page", () => {
    device.zone = { id: 101, name: "danger" };
    renderWithBrowserRouter(
      <DeviceListTable
        devices={[device]}
        onSelectedChange={jest.fn()}
        selectedIDs={[]}
      />,
      { state }
    );

    expect(screen.getAllByTestId("device-zone-link")[0]).toHaveAttribute(
      "href",
      urls.zones.details({ id: device.zone.id })
    );
  });

  describe("device list sorting", () => {
    const getRowTestId = (index: number) =>
      screen.getAllByRole("row")[index].getAttribute("data-testid");

    it("can sort by FQDN", async () => {
      const devices = [
        deviceFactory({ fqdn: "b", system_id: "b" }),
        deviceFactory({ fqdn: "c", system_id: "c" }),
        deviceFactory({ fqdn: "a", system_id: "a" }),
      ];
      renderWithBrowserRouter(
        <DeviceListTable
          devices={devices}
          onSelectedChange={jest.fn()}
          selectedIDs={[]}
        />,
        { state }
      );

      // Table is sorted be descending FQDN by default
      expect(getRowTestId(1)).toBe("device-a");
      expect(getRowTestId(2)).toBe("device-b");
      expect(getRowTestId(3)).toBe("device-c");

      // Change sort to ascending FQDN
      await userEvent.click(screen.getByRole("button", { name: "FQDN" }));
      expect(getRowTestId(1)).toBe("device-c");
      expect(getRowTestId(2)).toBe("device-b");
      expect(getRowTestId(3)).toBe("device-a");
    });

    it("can sort by IP assignment", async () => {
      const devices = [
        deviceFactory({
          ip_assignment: DeviceIpAssignment.EXTERNAL,
          system_id: "b",
        }),
        deviceFactory({
          ip_assignment: DeviceIpAssignment.DYNAMIC,
          system_id: "a",
        }),
        deviceFactory({
          ip_assignment: "",
          system_id: "c",
        }),
      ];
      renderWithBrowserRouter(
        <DeviceListTable
          devices={devices}
          onSelectedChange={jest.fn()}
          selectedIDs={[]}
        />,
        { state }
      );

      // Change sort to descending IP assignment
      await userEvent.click(
        screen.getByRole("button", { name: "IP assignment" })
      );
      expect(getRowTestId(1)).toBe("device-a");
      expect(getRowTestId(2)).toBe("device-b");
      expect(getRowTestId(3)).toBe("device-c");

      // Change sort to ascending IP assignment
      await userEvent.click(
        screen.getByRole("button", { name: "IP assignment" })
      );
      expect(getRowTestId(1)).toBe("device-c");
      expect(getRowTestId(2)).toBe("device-b");
      expect(getRowTestId(3)).toBe("device-a");
    });

    it("can sort by zone", async () => {
      const devices = [
        deviceFactory({ system_id: "c", zone: { id: 1, name: "twilight" } }),
        deviceFactory({ system_id: "a", zone: { id: 2, name: "danger" } }),
        deviceFactory({ system_id: "b", zone: { id: 3, name: "forbidden" } }),
      ];
      renderWithBrowserRouter(
        <DeviceListTable
          devices={devices}
          onSelectedChange={jest.fn()}
          selectedIDs={[]}
        />,
        { state }
      );

      // Change sort to descending zone name
      await userEvent.click(screen.getByRole("button", { name: "Zone" }));
      expect(getRowTestId(1)).toBe("device-a");
      expect(getRowTestId(2)).toBe("device-b");
      expect(getRowTestId(3)).toBe("device-c");

      // Change sort to ascending zone name
      await userEvent.click(screen.getByRole("button", { name: "Zone" }));
      expect(getRowTestId(1)).toBe("device-c");
      expect(getRowTestId(2)).toBe("device-b");
      expect(getRowTestId(3)).toBe("device-a");
    });

    it("can sort by owner", async () => {
      const devices = [
        deviceFactory({ owner: "user", system_id: "c" }),
        deviceFactory({ owner: "admin", system_id: "a" }),
        deviceFactory({ owner: "bob", system_id: "b" }),
      ];
      renderWithBrowserRouter(
        <DeviceListTable
          devices={devices}
          onSelectedChange={jest.fn()}
          selectedIDs={[]}
        />,
        { state }
      );

      // Change sort to descending owner
      await userEvent.click(screen.getByRole("button", { name: "Owner" }));
      expect(getRowTestId(1)).toBe("device-a");
      expect(getRowTestId(2)).toBe("device-b");
      expect(getRowTestId(3)).toBe("device-c");

      // Change sort to ascending owner
      await userEvent.click(screen.getByRole("button", { name: "Owner" }));
      expect(getRowTestId(1)).toBe("device-c");
      expect(getRowTestId(2)).toBe("device-b");
      expect(getRowTestId(3)).toBe("device-a");
    });
  });

  describe("device selection", () => {
    it("handles selecting a single device", async () => {
      const devices = [deviceFactory({ system_id: "abc123" })];
      const onSelectedChange = jest.fn();
      renderWithBrowserRouter(
        <DeviceListTable
          devices={devices}
          onSelectedChange={onSelectedChange}
          selectedIDs={[]}
        />,
        { state }
      );

      await userEvent.click(screen.getAllByTestId("device-checkbox")[0]);

      expect(onSelectedChange).toHaveBeenCalledWith(["abc123"]);
    });

    it("handles unselecting a single device", async () => {
      const devices = [deviceFactory({ system_id: "abc123" })];
      const onSelectedChange = jest.fn();
      renderWithBrowserRouter(
        <DeviceListTable
          devices={devices}
          onSelectedChange={onSelectedChange}
          selectedIDs={["abc123"]}
        />,
        { state }
      );

      await userEvent.click(screen.getAllByTestId("device-checkbox")[0]);

      expect(onSelectedChange).toHaveBeenCalledWith([]);
    });

    it("handles selecting all devices", async () => {
      const devices = [
        deviceFactory({ system_id: "abc123" }),
        deviceFactory({ system_id: "def456" }),
      ];
      const onSelectedChange = jest.fn();
      renderWithBrowserRouter(
        <DeviceListTable
          devices={devices}
          onSelectedChange={onSelectedChange}
          selectedIDs={[]}
        />,
        { state }
      );

      await userEvent.click(screen.getByTestId("all-devices-checkbox"));

      expect(onSelectedChange).toHaveBeenCalledWith(["abc123", "def456"]);
    });

    it("handles unselecting all devices", async () => {
      const devices = [
        deviceFactory({ system_id: "abc123" }),
        deviceFactory({ system_id: "def456" }),
      ];
      const onSelectedChange = jest.fn();
      renderWithBrowserRouter(
        <DeviceListTable
          devices={devices}
          onSelectedChange={onSelectedChange}
          selectedIDs={["abc123", "def456"]}
        />,
        { state }
      );

      await userEvent.click(screen.getByTestId("all-devices-checkbox"));

      expect(onSelectedChange).toHaveBeenCalledWith([]);
    });
  });
});

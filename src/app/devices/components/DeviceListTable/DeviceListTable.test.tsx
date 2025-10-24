import DeviceListTable, { Labels } from "./DeviceListTable";

import urls from "@/app/base/urls";
import type { Device } from "@/app/store/device/types";
import { DeviceIpAssignment } from "@/app/store/device/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithProviders, screen, userEvent } from "@/testing/utils";

describe("DeviceListTable", () => {
  let device: Device;
  let state: RootState;

  beforeEach(() => {
    device = factory.device({
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
    state = factory.rootState({
      device: factory.deviceState({ items: [device] }),
    });
  });

  it("links to a device's details page", () => {
    device.system_id = "def456";
    renderWithProviders(
      <DeviceListTable
        devices={[device]}
        onSelectedChange={vi.fn()}
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
    renderWithProviders(
      <DeviceListTable
        devices={[device]}
        onSelectedChange={vi.fn()}
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
    renderWithProviders(
      <DeviceListTable
        devices={[device]}
        onSelectedChange={vi.fn()}
        selectedIDs={[]}
      />,
      { state }
    );

    expect(screen.getAllByTestId("device-zone-link")[0]).toHaveAttribute(
      "href",
      urls.zones.index
    );
  });

  describe("device list sorting", () => {
    const getRowTestId = (index: number) =>
      screen.getAllByRole("row")[index].getAttribute("data-testid");

    it("can sort by FQDN", async () => {
      const devices = [
        factory.device({ fqdn: "b", system_id: "b" }),
        factory.device({ fqdn: "c", system_id: "c" }),
        factory.device({ fqdn: "a", system_id: "a" }),
      ];
      renderWithProviders(
        <DeviceListTable
          devices={devices}
          onSelectedChange={vi.fn()}
          selectedIDs={[]}
        />,
        { state }
      );

      // Table is sorted be descending FQDN by default
      expect(getRowTestId(1)).toBe("device-a");
      expect(getRowTestId(2)).toBe("device-b");
      expect(getRowTestId(3)).toBe("device-c");

      // Change sort to ascending FQDN
      await userEvent.click(
        screen.getByRole("button", { name: "FQDN (descending)" })
      );
      expect(getRowTestId(1)).toBe("device-c");
      expect(getRowTestId(2)).toBe("device-b");
      expect(getRowTestId(3)).toBe("device-a");
    });

    it("can sort by IP assignment", async () => {
      const devices = [
        factory.device({
          ip_assignment: DeviceIpAssignment.EXTERNAL,
          system_id: "b",
        }),
        factory.device({
          ip_assignment: DeviceIpAssignment.DYNAMIC,
          system_id: "a",
        }),
        factory.device({
          ip_assignment: "",
          system_id: "c",
        }),
      ];
      renderWithProviders(
        <DeviceListTable
          devices={devices}
          onSelectedChange={vi.fn()}
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
        screen.getByRole("button", { name: "IP assignment (descending)" })
      );
      expect(getRowTestId(1)).toBe("device-c");
      expect(getRowTestId(2)).toBe("device-b");
      expect(getRowTestId(3)).toBe("device-a");
    });

    it("can sort by zone", async () => {
      const devices = [
        factory.device({ system_id: "c", zone: { id: 1, name: "twilight" } }),
        factory.device({ system_id: "a", zone: { id: 2, name: "danger" } }),
        factory.device({ system_id: "b", zone: { id: 3, name: "forbidden" } }),
      ];
      renderWithProviders(
        <DeviceListTable
          devices={devices}
          onSelectedChange={vi.fn()}
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
      await userEvent.click(
        screen.getByRole("button", { name: "Zone (descending)" })
      );
      expect(getRowTestId(1)).toBe("device-c");
      expect(getRowTestId(2)).toBe("device-b");
      expect(getRowTestId(3)).toBe("device-a");
    });

    it("can sort by owner", async () => {
      const devices = [
        factory.device({ owner: "user", system_id: "c" }),
        factory.device({ owner: "admin", system_id: "a" }),
        factory.device({ owner: "bob", system_id: "b" }),
      ];
      renderWithProviders(
        <DeviceListTable
          devices={devices}
          onSelectedChange={vi.fn()}
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
      await userEvent.click(
        screen.getByRole("button", { name: "Owner (descending)" })
      );
      expect(getRowTestId(1)).toBe("device-c");
      expect(getRowTestId(2)).toBe("device-b");
      expect(getRowTestId(3)).toBe("device-a");
    });
  });

  describe("device selection", () => {
    it("handles selecting a single device", async () => {
      const devices = [factory.device({ system_id: "abc123" })];
      const onSelectedChange = vi.fn();
      renderWithProviders(
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
      const devices = [factory.device({ system_id: "abc123" })];
      const onSelectedChange = vi.fn();
      renderWithProviders(
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
        factory.device({ system_id: "abc123" }),
        factory.device({ system_id: "def456" }),
      ];
      const onSelectedChange = vi.fn();
      renderWithProviders(
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
        factory.device({ system_id: "abc123" }),
        factory.device({ system_id: "def456" }),
      ];
      const onSelectedChange = vi.fn();
      renderWithProviders(
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

  it("displays a message when empty", () => {
    const onSelectedChange = vi.fn();
    renderWithProviders(
      <DeviceListTable
        devices={[]}
        onSelectedChange={onSelectedChange}
        selectedIDs={[]}
      />,
      { state }
    );

    expect(screen.getByText(Labels.EmptyList)).toBeInTheDocument();
  });
});

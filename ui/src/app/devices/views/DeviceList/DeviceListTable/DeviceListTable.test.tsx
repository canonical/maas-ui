import type { ReactWrapper } from "enzyme";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";

import DeviceListTable from "./DeviceListTable";

import deviceURLs from "app/devices/urls";
import type { Device } from "app/store/device/types";
import { DeviceIpAssignment } from "app/store/device/types";
import zoneURLs from "app/zones/urls";
import { device as deviceFactory } from "testing/factories";

describe("DeviceListTable", () => {
  let device: Device;

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
      tags: ["tag1", "tag2"],
      zone: { id: 2, name: "zone" },
    });
  });

  it("links to a device's details page", () => {
    device.system_id = "def456";
    const wrapper = mount(
      <MemoryRouter>
        <DeviceListTable devices={[device]} />
      </MemoryRouter>
    );

    expect(
      wrapper.find("Link[data-testid='device-details-link']").at(0).prop("to")
    ).toBe(deviceURLs.device.index({ id: device.system_id }));
  });

  it("can show when a device has more than one mac address", () => {
    device.primary_mac = "11:11:11:11:11:11";
    device.extra_macs = ["22:22:22:22:22:22", "33:33:33:33:33:33"];
    const wrapper = mount(
      <MemoryRouter>
        <DeviceListTable devices={[device]} />
      </MemoryRouter>
    );

    expect(wrapper.find("[data-testid='mac-display']").at(0).text()).toBe(
      "11:11:11:11:11:11 (+2)"
    );
  });

  it("links to a device's zone's details page", () => {
    device.zone = { id: 101, name: "danger" };
    const wrapper = mount(
      <MemoryRouter>
        <DeviceListTable devices={[device]} />
      </MemoryRouter>
    );

    expect(
      wrapper.find("Link[data-testid='device-zone-link']").at(0).prop("to")
    ).toBe(zoneURLs.details({ id: device.zone.id }));
  });

  describe("device list sorting", () => {
    const getRowTestId = (wrapper: ReactWrapper, index: number) =>
      wrapper.find("tbody tr").at(index).prop("data-testid");

    it("can sort by FQDN", () => {
      const devices = [
        deviceFactory({ fqdn: "b", system_id: "b" }),
        deviceFactory({ fqdn: "c", system_id: "c" }),
        deviceFactory({ fqdn: "a", system_id: "a" }),
      ];
      const wrapper = mount(
        <MemoryRouter>
          <DeviceListTable devices={devices} />
        </MemoryRouter>
      );

      // Table is sorted be descending FQDN by default
      expect(getRowTestId(wrapper, 0)).toBe("device-a");
      expect(getRowTestId(wrapper, 1)).toBe("device-b");
      expect(getRowTestId(wrapper, 2)).toBe("device-c");

      // Change sort to ascending FQDN
      wrapper.find("[data-testid='fqdn-header']").simulate("click");
      expect(getRowTestId(wrapper, 0)).toBe("device-c");
      expect(getRowTestId(wrapper, 1)).toBe("device-b");
      expect(getRowTestId(wrapper, 2)).toBe("device-a");
    });

    it("can sort by IP assignment", () => {
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
      const wrapper = mount(
        <MemoryRouter>
          <DeviceListTable devices={devices} />
        </MemoryRouter>
      );

      // Change sort to descending IP assignment
      wrapper.find("[data-testid='ip-header']").simulate("click");
      expect(getRowTestId(wrapper, 0)).toBe("device-a");
      expect(getRowTestId(wrapper, 1)).toBe("device-b");
      expect(getRowTestId(wrapper, 2)).toBe("device-c");

      // Change sort to ascending IP assignment
      wrapper.find("[data-testid='ip-header']").simulate("click");
      expect(getRowTestId(wrapper, 0)).toBe("device-c");
      expect(getRowTestId(wrapper, 1)).toBe("device-b");
      expect(getRowTestId(wrapper, 2)).toBe("device-a");
    });

    it("can sort by zone", () => {
      const devices = [
        deviceFactory({ system_id: "c", zone: { id: 1, name: "twilight" } }),
        deviceFactory({ system_id: "a", zone: { id: 2, name: "danger" } }),
        deviceFactory({ system_id: "b", zone: { id: 3, name: "forbidden" } }),
      ];
      const wrapper = mount(
        <MemoryRouter>
          <DeviceListTable devices={devices} />
        </MemoryRouter>
      );

      // Change sort to descending zone name
      wrapper.find("[data-testid='zone-header']").simulate("click");
      expect(getRowTestId(wrapper, 0)).toBe("device-a");
      expect(getRowTestId(wrapper, 1)).toBe("device-b");
      expect(getRowTestId(wrapper, 2)).toBe("device-c");

      // Change sort to ascending zone name
      wrapper.find("[data-testid='zone-header']").simulate("click");
      expect(getRowTestId(wrapper, 0)).toBe("device-c");
      expect(getRowTestId(wrapper, 1)).toBe("device-b");
      expect(getRowTestId(wrapper, 2)).toBe("device-a");
    });

    it("can sort by owner", () => {
      const devices = [
        deviceFactory({ owner: "user", system_id: "c" }),
        deviceFactory({ owner: "admin", system_id: "a" }),
        deviceFactory({ owner: "bob", system_id: "b" }),
      ];
      const wrapper = mount(
        <MemoryRouter>
          <DeviceListTable devices={devices} />
        </MemoryRouter>
      );

      // Change sort to descending owner
      wrapper.find("[data-testid='owner-header']").simulate("click");
      expect(getRowTestId(wrapper, 0)).toBe("device-a");
      expect(getRowTestId(wrapper, 1)).toBe("device-b");
      expect(getRowTestId(wrapper, 2)).toBe("device-c");

      // Change sort to ascending owner
      wrapper.find("[data-testid='owner-header']").simulate("click");
      expect(getRowTestId(wrapper, 0)).toBe("device-c");
      expect(getRowTestId(wrapper, 1)).toBe("device-b");
      expect(getRowTestId(wrapper, 2)).toBe("device-a");
    });
  });
});

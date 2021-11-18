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
      wrapper.find("Link[data-test='device-details-link']").at(0).prop("to")
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

    expect(wrapper.find("[data-test='mac-display']").at(0).text()).toBe(
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
      wrapper.find("Link[data-test='device-zone-link']").at(0).prop("to")
    ).toBe(zoneURLs.details({ id: device.zone.id }));
  });
});

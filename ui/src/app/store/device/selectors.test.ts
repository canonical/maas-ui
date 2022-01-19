import { NetworkInterfaceTypes } from "../types/enum";

import device from "./selectors";

import {
  rootState as rootStateFactory,
  device as deviceFactory,
  deviceDetails as deviceDetailsFactory,
  deviceEventError as deviceEventErrorFactory,
  deviceInterface as deviceInterfaceFactory,
  deviceState as deviceStateFactory,
  deviceStatus as deviceStatusFactory,
  deviceStatuses as deviceStatusesFactory,
  networkLink as networkLinkFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";

describe("device selectors", () => {
  it("can get all items", () => {
    const items = [deviceFactory(), deviceFactory()];
    const state = rootStateFactory({
      device: deviceStateFactory({
        items,
      }),
    });
    expect(device.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      device: deviceStateFactory({
        loading: true,
      }),
    });
    expect(device.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      device: deviceStateFactory({
        loaded: true,
      }),
    });
    expect(device.loaded(state)).toEqual(true);
  });

  it("can get a device by id", () => {
    const items = [
      deviceFactory({ system_id: "808" }),
      deviceFactory({ system_id: "909" }),
    ];
    const state = rootStateFactory({
      device: deviceStateFactory({
        items,
      }),
    });
    expect(device.getById(state, "909")).toStrictEqual(items[1]);
  });

  it("can get a status for a device", () => {
    const state = rootStateFactory({
      device: deviceStateFactory({
        items: [deviceFactory({ system_id: "abc123" })],
        statuses: deviceStatusesFactory({
          abc123: deviceStatusFactory({ creatingInterface: true }),
        }),
      }),
    });
    expect(
      device.getStatusForDevice(state, "abc123", "creatingInterface")
    ).toBe(true);
  });

  it("can get event errors for a device", () => {
    const deviceEventErrors = [
      deviceEventErrorFactory({ id: "abc123" }),
      deviceEventErrorFactory(),
    ];
    const state = rootStateFactory({
      device: deviceStateFactory({
        eventErrors: deviceEventErrors,
      }),
    });
    expect(device.eventErrorsForDevices(state, "abc123")).toStrictEqual([
      deviceEventErrors[0],
    ]);
  });

  it("can get event errors for a device and a provided event", () => {
    const deviceEventErrors = [
      deviceEventErrorFactory({ id: "abc123", event: "creatingInterface" }),
      deviceEventErrorFactory({ event: "creatingInterface" }),
    ];
    const state = rootStateFactory({
      device: deviceStateFactory({
        eventErrors: deviceEventErrors,
      }),
    });
    expect(device.eventErrorsForDevices(state, "abc123")).toStrictEqual([
      deviceEventErrors[0],
    ]);
  });

  it("can get event errors for a device and no event", () => {
    const deviceEventErrors = [
      deviceEventErrorFactory({ id: "abc123", event: null }),
      deviceEventErrorFactory({ id: "abc123", event: "creatingInterface" }),
      deviceEventErrorFactory({ event: null }),
    ];
    const state = rootStateFactory({
      device: deviceStateFactory({
        eventErrors: deviceEventErrors,
      }),
    });
    expect(device.eventErrorsForDevices(state, "abc123", null)).toStrictEqual([
      deviceEventErrors[0],
    ]);
  });

  it("can get event errors for multiple devices", () => {
    const deviceEventErrors = [
      deviceEventErrorFactory({ id: "abc123" }),
      deviceEventErrorFactory({ id: "def456" }),
      deviceEventErrorFactory(),
    ];
    const state = rootStateFactory({
      device: deviceStateFactory({
        eventErrors: deviceEventErrors,
      }),
    });
    expect(
      device.eventErrorsForDevices(state, ["abc123", "def456"])
    ).toStrictEqual([deviceEventErrors[0], deviceEventErrors[1]]);
  });

  it("can get event errors for multiple devices and a provided event", () => {
    const deviceEventErrors = [
      deviceEventErrorFactory({ id: "abc123", event: "creatingInterface" }),
      deviceEventErrorFactory({ id: "def456", event: "creatingInterface" }),
      deviceEventErrorFactory({ event: "creatingInterface" }),
    ];
    const state = rootStateFactory({
      device: deviceStateFactory({
        eventErrors: deviceEventErrors,
      }),
    });
    expect(
      device.eventErrorsForDevices(
        state,
        ["abc123", "def456"],
        "creatingInterface"
      )
    ).toStrictEqual([deviceEventErrors[0], deviceEventErrors[1]]);
  });

  it("can get event errors for multiple devices and no event", () => {
    const deviceEventErrors = [
      deviceEventErrorFactory({ id: "abc123", event: null }),
      deviceEventErrorFactory({ id: "def456", event: null }),
      deviceEventErrorFactory({ id: "abc123", event: "creatingInterface" }),
      deviceEventErrorFactory({ id: "def456", event: "creatingInterface" }),
      deviceEventErrorFactory({ event: null }),
    ];
    const state = rootStateFactory({
      device: deviceStateFactory({
        eventErrors: deviceEventErrors,
      }),
    });
    expect(
      device.eventErrorsForDevices(state, ["abc123", "def456"], null)
    ).toStrictEqual([deviceEventErrors[0], deviceEventErrors[1]]);
  });

  it("can get the active device's system ID", () => {
    const state = rootStateFactory({
      device: deviceStateFactory({
        active: "abc123",
      }),
    });
    expect(device.activeID(state)).toEqual("abc123");
  });

  it("can get the active device", () => {
    const activeDevice = deviceFactory();
    const state = rootStateFactory({
      device: deviceStateFactory({
        active: activeDevice.system_id,
        items: [activeDevice],
      }),
    });
    expect(device.active(state)).toEqual(activeDevice);
  });

  it("can get the selected device's system ID", () => {
    const state = rootStateFactory({
      device: deviceStateFactory({
        selected: ["abc123"],
      }),
    });
    expect(device.selectedIDs(state)).toStrictEqual(["abc123"]);
  });

  it("can get the selected device", () => {
    const selectedDevice = deviceFactory();
    const state = rootStateFactory({
      device: deviceStateFactory({
        selected: [selectedDevice.system_id],
        items: [selectedDevice],
      }),
    });
    expect(device.selected(state)).toStrictEqual([selectedDevice]);
  });

  it("can search devices by their properties", () => {
    const state = rootStateFactory({
      device: deviceStateFactory({
        items: [
          deviceFactory({
            hostname: "foo",
            owner: "rob",
          }),
          deviceFactory({
            hostname: "bar",
            owner: "foodie",
          }),
          deviceFactory({
            hostname: "foobar",
            owner: "bazza",
          }),
          deviceFactory({
            hostname: "baz",
            owner: "robert",
            tags: [1],
          }),
        ],
      }),
      tag: tagStateFactory({
        items: [tagFactory({ id: 1, name: "echidna" })],
      }),
    });

    // Get all devices with "foo" in any of the properties.
    let results = device.search(state, "foo", []);
    expect(results.length).toEqual(3);
    expect(results[0].hostname).toEqual("foo");
    expect(results[1].owner).toEqual("foodie");
    expect(results[2].hostname).toEqual("foobar");

    // Get all devices with "bar" in the hostname.
    results = device.search(state, "hostname:bar", []);
    expect(results.length).toEqual(2);
    expect(results[0].hostname).toEqual("bar");
    expect(results[1].hostname).toEqual("foobar");

    // Get all devices with "rob" as the owner.
    results = device.search(state, "owner:=rob", []);
    expect(results.length).toEqual(1);
    expect(results[0].owner).toEqual("rob");

    // Get all devices without "baz" in any of the properties.
    results = device.search(state, "!baz", []);
    expect(results.length).toEqual(2);
    expect(results[0].hostname).toEqual("foo");
    expect(results[1].hostname).toEqual("bar");

    // Get all devices without "baz" in any of the properties.
    results = device.search(state, "echidna", []);
    expect(results.length).toEqual(1);
    expect(results[0].hostname).toEqual("baz");
  });

  it("can get an interface by id", () => {
    const nic = deviceInterfaceFactory({
      type: NetworkInterfaceTypes.PHYSICAL,
    });
    const node = deviceDetailsFactory({
      interfaces: [nic],
    });
    const state = rootStateFactory({
      device: deviceStateFactory({
        items: [node],
      }),
    });
    expect(
      device.getInterfaceById(state, node.system_id, nic.id)
    ).toStrictEqual(nic);
  });

  it("can get an interface by link id", () => {
    const link = networkLinkFactory();
    const nic = deviceInterfaceFactory({
      links: [link],
      type: NetworkInterfaceTypes.PHYSICAL,
    });
    const node = deviceDetailsFactory({
      interfaces: [nic],
    });
    const state = rootStateFactory({
      device: deviceStateFactory({
        items: [node],
      }),
    });
    expect(
      device.getInterfaceById(state, node.system_id, null, link.id)
    ).toStrictEqual(nic);
  });
});

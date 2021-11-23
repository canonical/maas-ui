import device from "./selectors";

import {
  rootState as rootStateFactory,
  device as deviceFactory,
  deviceEventError as deviceEventErrorFactory,
  deviceState as deviceStateFactory,
  deviceStatus as deviceStatusFactory,
  deviceStatuses as deviceStatusesFactory,
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
});

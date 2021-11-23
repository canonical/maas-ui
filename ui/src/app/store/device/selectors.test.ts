import device from "./selectors";

import {
  rootState as rootStateFactory,
  device as deviceFactory,
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

  it("can get a status for a machine", () => {
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
});

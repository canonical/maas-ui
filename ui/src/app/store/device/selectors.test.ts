import type { TSFixMe } from "app/base/types";
import device from "./selectors";

describe("device selectors", () => {
  it("can get all items", () => {
    const state: TSFixMe = {
      device: {
        items: [{ name: "maas.test" }],
      },
    };
    expect(device.all(state)).toEqual([{ name: "maas.test" }]);
  });

  it("can get the loading state", () => {
    const state: TSFixMe = {
      device: {
        loading: true,
        items: [],
      },
    };
    expect(device.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state: TSFixMe = {
      device: {
        loaded: true,
        items: [],
      },
    };
    expect(device.loaded(state)).toEqual(true);
  });

  it("can get a device by id", () => {
    const state: TSFixMe = {
      device: {
        items: [
          { name: "maas.test", system_id: 808 },
          { name: "10.0.0.99", system_id: 909 },
        ],
      },
    };
    expect(device.getBySystemId(state, 909)).toStrictEqual({
      name: "10.0.0.99",
      system_id: 909,
    });
  });
});

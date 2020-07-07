import device from "./device";

describe("device selectors", () => {
  it("can get all items", () => {
    const state = {
      device: {
        items: [{ name: "maas.test" }],
      },
    };
    expect(device.all(state)).toEqual([{ name: "maas.test" }]);
  });

  it("can get the loading state", () => {
    const state = {
      device: {
        loading: true,
        items: [],
      },
    };
    expect(device.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = {
      device: {
        loaded: true,
        items: [],
      },
    };
    expect(device.loaded(state)).toEqual(true);
  });

  it("can get a device by id", () => {
    const state = {
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

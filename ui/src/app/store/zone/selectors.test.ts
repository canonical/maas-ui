import {
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import zone from "./selectors";

describe("zone selectors", () => {
  it("can get all items", () => {
    const items = [zoneFactory(), zoneFactory()];
    const state = {
      zone: zoneStateFactory({
        items,
      }),
    };
    expect(zone.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state: TSFixMe = {
      zone: {
        loading: true,
        items: [],
      },
    };
    expect(zone.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state: TSFixMe = {
      zone: {
        loaded: true,
        items: [],
      },
    };
    expect(zone.loaded(state)).toEqual(true);
  });

  it("can get the errors state", () => {
    const state: TSFixMe = {
      zone: {
        errors: "Data is incorrect",
      },
    };
    expect(zone.errors(state)).toStrictEqual("Data is incorrect");
  });

  it("can get a zone by id", () => {
    const state: TSFixMe = {
      zone: {
        items: [
          { name: "foo", id: 1 },
          { name: "bar", id: 2 },
        ],
      },
    };
    expect(zone.getById(state, 1)).toStrictEqual({
      name: "foo",
      id: 1,
    });
  });
});

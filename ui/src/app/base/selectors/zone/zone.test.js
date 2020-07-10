import {
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import zone from "./zone";

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
    const state = {
      zone: {
        loading: true,
        items: [],
      },
    };
    expect(zone.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = {
      zone: {
        loaded: true,
        items: [],
      },
    };
    expect(zone.loaded(state)).toEqual(true);
  });

  it("can get the errors state", () => {
    const state = {
      zone: {
        errors: "Data is incorrect",
      },
    };
    expect(zone.errors(state)).toStrictEqual("Data is incorrect");
  });

  it("can get a zone by id", () => {
    const state = {
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

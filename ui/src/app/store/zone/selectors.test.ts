import zone from "./selectors";

import {
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

describe("zone selectors", () => {
  it("can get all items", () => {
    const items = [zoneFactory(), zoneFactory()];
    const state = rootStateFactory({
      zone: zoneStateFactory({
        items,
      }),
    });
    expect(zone.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      zone: zoneStateFactory({
        loading: true,
      }),
    });
    expect(zone.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      zone: zoneStateFactory({
        loaded: true,
      }),
    });
    expect(zone.loaded(state)).toEqual(true);
  });

  it("can get the errors state", () => {
    const state = rootStateFactory({
      zone: zoneStateFactory({
        errors: "Data is incorrect",
      }),
    });
    expect(zone.errors(state)).toStrictEqual("Data is incorrect");
  });

  it("can get a zone by id", () => {
    const items = [zoneFactory({ id: 1 }), zoneFactory({ id: 2 })];
    const state = rootStateFactory({
      zone: zoneStateFactory({
        items,
      }),
    });
    expect(zone.getById(state, 1)).toStrictEqual(items[0]);
  });
});

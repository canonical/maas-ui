import {
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import resourcepool from "./selectors";

describe("resourcepool selectors", () => {
  it("can get all items", () => {
    const items = [resourcePoolFactory(), resourcePoolFactory()];
    const state = rootStateFactory({
      resourcepool: resourcePoolStateFactory({
        items,
      }),
    });
    expect(resourcepool.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      resourcepool: resourcePoolStateFactory({
        loading: true,
      }),
    });
    expect(resourcepool.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      resourcepool: resourcePoolStateFactory({
        loaded: true,
      }),
    });
    expect(resourcepool.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = rootStateFactory({
      resourcepool: resourcePoolStateFactory({
        saving: true,
      }),
    });
    expect(resourcepool.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = rootStateFactory({
      resourcepool: resourcePoolStateFactory({
        saved: true,
      }),
    });
    expect(resourcepool.saved(state)).toEqual(true);
  });

  it("can get the errors state", () => {
    const state = rootStateFactory({
      resourcepool: resourcePoolStateFactory({
        errors: "Data is incorrect",
      }),
    });
    expect(resourcepool.errors(state)).toStrictEqual("Data is incorrect");
  });

  it("can get a pool by id", () => {
    const items = [
      resourcePoolFactory({ id: 101 }),
      resourcePoolFactory({ id: 123 }),
    ];
    const state = rootStateFactory({
      resourcepool: resourcePoolStateFactory({
        items,
      }),
    });
    expect(resourcepool.getById(state, 101)).toStrictEqual(items[0]);
  });
});

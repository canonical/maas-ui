import resourcepool from "./selectors";

import * as factory from "@/testing/factories";

describe("resourcepool selectors", () => {
  it("can get all items", () => {
    const items = [factory.resourcePool(), factory.resourcePool()];
    const state = factory.rootState({
      resourcepool: factory.resourcePoolState({
        items,
      }),
    });
    expect(resourcepool.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = factory.rootState({
      resourcepool: factory.resourcePoolState({
        loading: true,
      }),
    });
    expect(resourcepool.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = factory.rootState({
      resourcepool: factory.resourcePoolState({
        loaded: true,
      }),
    });
    expect(resourcepool.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = factory.rootState({
      resourcepool: factory.resourcePoolState({
        saving: true,
      }),
    });
    expect(resourcepool.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = factory.rootState({
      resourcepool: factory.resourcePoolState({
        saved: true,
      }),
    });
    expect(resourcepool.saved(state)).toEqual(true);
  });

  it("can get the errors state", () => {
    const state = factory.rootState({
      resourcepool: factory.resourcePoolState({
        errors: "Data is incorrect",
      }),
    });
    expect(resourcepool.errors(state)).toStrictEqual("Data is incorrect");
  });

  it("can get a pool by id", () => {
    const items = [
      factory.resourcePool({ id: 101 }),
      factory.resourcePool({ id: 123 }),
    ];
    const state = factory.rootState({
      resourcepool: factory.resourcePoolState({
        items,
      }),
    });
    expect(resourcepool.getById(state, 101)).toStrictEqual(items[0]);
  });
});

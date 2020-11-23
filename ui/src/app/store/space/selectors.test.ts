import space from "./selectors";

import {
  space as spaceFactory,
  spaceState as spaceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("space selectors", () => {
  it("can get all items", () => {
    const items = [spaceFactory()];
    const state = rootStateFactory({
      space: spaceStateFactory({
        items,
      }),
    });
    expect(space.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      space: spaceStateFactory({
        loading: true,
      }),
    });
    expect(space.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      space: spaceStateFactory({
        loaded: true,
      }),
    });
    expect(space.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = rootStateFactory({
      space: spaceStateFactory({
        saving: true,
      }),
    });
    expect(space.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = rootStateFactory({
      space: spaceStateFactory({
        saved: true,
      }),
    });
    expect(space.saved(state)).toEqual(true);
  });

  it("can get the errors state", () => {
    const state = rootStateFactory({
      space: spaceStateFactory({
        errors: "errors!",
      }),
    });
    expect(space.errors(state)).toEqual("errors!");
  });

  it("can get a space by id", () => {
    const items = [spaceFactory({ id: 10 }), spaceFactory({ id: 42 })];
    const state = rootStateFactory({
      space: spaceStateFactory({
        items,
      }),
    });
    expect(space.getById(state, 42)).toStrictEqual(items[1]);
  });

  it("can filter spaces by name", () => {
    const items = [
      spaceFactory({ name: "abc" }),
      spaceFactory({ name: "def" }),
    ];
    const state = rootStateFactory({
      space: spaceStateFactory({
        items,
      }),
    });
    expect(space.search(state, "d")).toStrictEqual([items[1]]);
  });
});

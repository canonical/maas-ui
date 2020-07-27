import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import fabric from "./selectors";

describe("fabric selectors", () => {
  it("can get all items", () => {
    const items = [fabricFactory()];
    const state = rootStateFactory({
      fabric: fabricStateFactory({
        items,
      }),
    });
    expect(fabric.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      fabric: fabricStateFactory({
        loading: true,
      }),
    });
    expect(fabric.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      fabric: fabricStateFactory({
        loaded: true,
      }),
    });
    expect(fabric.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = rootStateFactory({
      fabric: fabricStateFactory({
        saving: true,
      }),
    });
    expect(fabric.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = rootStateFactory({
      fabric: fabricStateFactory({
        saved: true,
      }),
    });
    expect(fabric.saved(state)).toEqual(true);
  });

  it("can get the errors state", () => {
    const state = rootStateFactory({
      fabric: fabricStateFactory({
        errors: "errors!",
      }),
    });
    expect(fabric.errors(state)).toEqual("errors!");
  });

  it("can get a fabric by id", () => {
    const items = [fabricFactory({ id: 10 }), fabricFactory({ id: 42 })];
    const state = rootStateFactory({
      fabric: fabricStateFactory({
        items,
      }),
    });
    expect(fabric.getById(state, 42)).toStrictEqual(items[1]);
  });

  it("can filter fabrics by name", () => {
    const items = [
      fabricFactory({ name: "abc" }),
      fabricFactory({ name: "def" }),
    ];
    const state = rootStateFactory({
      fabric: fabricStateFactory({
        items,
      }),
    });
    expect(fabric.search(state, "d")).toStrictEqual([items[1]]);
  });
});

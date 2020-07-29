import {
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import vlan from "./selectors";

describe("vlan selectors", () => {
  it("can get all items", () => {
    const items = [vlanFactory()];
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        items,
      }),
    });
    expect(vlan.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        loading: true,
      }),
    });
    expect(vlan.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        loaded: true,
      }),
    });
    expect(vlan.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        saving: true,
      }),
    });
    expect(vlan.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        saved: true,
      }),
    });
    expect(vlan.saved(state)).toEqual(true);
  });

  it("can get the errors state", () => {
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        errors: "errors!",
      }),
    });
    expect(vlan.errors(state)).toEqual("errors!");
  });

  it("can get a vlan by id", () => {
    const items = [vlanFactory({ id: 10 }), vlanFactory({ id: 42 })];
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        items,
      }),
    });
    expect(vlan.getById(state, 42)).toStrictEqual(items[1]);
  });

  it("can filter vlans by name", () => {
    const items = [vlanFactory({ name: "abc" }), vlanFactory({ name: "def" })];
    const state = rootStateFactory({
      vlan: vlanStateFactory({
        items,
      }),
    });
    expect(vlan.search(state, "d")).toStrictEqual([items[1]]);
  });
});

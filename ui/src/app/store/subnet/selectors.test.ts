import {
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
} from "testing/factories";
import subnet from "./selectors";

describe("subnet selectors", () => {
  it("can get all items", () => {
    const items = [subnetFactory(), subnetFactory()];
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        items,
      }),
    });
    expect(subnet.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        loading: true,
      }),
    });
    expect(subnet.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        loaded: true,
      }),
    });
    expect(subnet.loaded(state)).toEqual(true);
  });

  it("can get a subnet by id", () => {
    const items = [subnetFactory({ id: 808 }), subnetFactory({ id: 909 })];
    const state = rootStateFactory({
      subnet: subnetStateFactory({
        items,
      }),
    });
    expect(subnet.getById(state, 909)).toStrictEqual(items[1]);
  });
});

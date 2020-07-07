import {
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
} from "testing/factories";
import subnet from "./selectors";

describe("subnet selectors", () => {
  it("can get all items", () => {
    const items = [subnetFactory(), subnetFactory()];
    const state = {
      subnet: subnetStateFactory({
        items,
      }),
    };
    expect(subnet.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state: TSFixMe = {
      subnet: {
        loading: true,
        items: [],
      },
    };
    expect(subnet.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state: TSFixMe = {
      subnet: {
        loaded: true,
        items: [],
      },
    };
    expect(subnet.loaded(state)).toEqual(true);
  });

  it("can get a subnet by id", () => {
    const state: TSFixMe = {
      subnet: {
        items: [
          { name: "maas.test", id: 808 },
          { name: "10.0.0.99", id: 909 },
        ],
      },
    };
    expect(subnet.getById(state, 909)).toStrictEqual({
      name: "10.0.0.99",
      id: 909,
    });
  });
});

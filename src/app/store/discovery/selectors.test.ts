import selectors from "./selectors";

import * as factory from "@/testing/factories";

describe("discovery selectors", () => {
  it("can get all items", () => {
    const items = [factory.discovery()];
    const state = factory.rootState({
      discovery: factory.discoveryState({
        items,
      }),
    });
    expect(selectors.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = factory.rootState({
      discovery: factory.discoveryState({
        loading: true,
      }),
    });
    expect(selectors.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = factory.rootState({
      discovery: factory.discoveryState({
        loaded: true,
      }),
    });
    expect(selectors.loaded(state)).toEqual(true);
  });

  it("can get the errors state", () => {
    const errors = "Nothing to discover";
    const state = factory.rootState({
      discovery: factory.discoveryState({
        errors,
      }),
    });
    expect(selectors.errors(state)).toEqual(errors);
  });

  it("can get a discovery by id", () => {
    const discovery = factory.discovery({ discovery_id: "123" });
    const state = factory.rootState({
      discovery: factory.discoveryState({
        items: [discovery],
      }),
    });
    expect(selectors.getById(state, "123")).toEqual(discovery);
    expect(selectors.getById(state, "456")).toEqual(null);
  });
});

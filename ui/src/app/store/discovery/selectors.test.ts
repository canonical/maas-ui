import selectors from "./selectors";

import {
  discovery as discoveryFactory,
  discoveryState as discoveryStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("discovery selectors", () => {
  it("can get all items", () => {
    const items = [discoveryFactory()];
    const state = rootStateFactory({
      discovery: discoveryStateFactory({
        items,
      }),
    });
    expect(selectors.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      discovery: discoveryStateFactory({
        loading: true,
      }),
    });
    expect(selectors.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      discovery: discoveryStateFactory({
        loaded: true,
      }),
    });
    expect(selectors.loaded(state)).toEqual(true);
  });

  it("can get the errors state", () => {
    const errors = "Nothing to discover";
    const state = rootStateFactory({
      discovery: discoveryStateFactory({
        errors,
      }),
    });
    expect(selectors.errors(state)).toEqual(errors);
  });

  it("can get a discovery by id", () => {
    const discovery = discoveryFactory({ discovery_id: "123" });
    const state = rootStateFactory({
      discovery: discoveryStateFactory({
        items: [discovery],
      }),
    });
    expect(selectors.getById(state, "123")).toEqual(discovery);
    expect(selectors.getById(state, "456")).toEqual(null);
  });
});

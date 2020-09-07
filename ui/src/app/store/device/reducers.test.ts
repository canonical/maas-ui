import { device as deviceFactory } from "testing/factories";
import reducers, { actions } from "./";

describe("device reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual({
      errors: null,
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("reduces fetchStart", () => {
    expect(reducers(undefined, actions.fetchStart())).toEqual({
      errors: null,
      items: [],
      loaded: false,
      loading: true,
      saved: false,
      saving: false,
    });
  });

  it("reduces fetchSuccess", () => {
    const devices = [deviceFactory(), deviceFactory()];
    expect(
      reducers(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true,
          saved: false,
          saving: false,
        },
        actions.fetchSuccess(devices)
      )
    ).toEqual({
      errors: {},
      loading: false,
      loaded: true,
      items: devices,
      saved: false,
      saving: false,
    });
  });
});

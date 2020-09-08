import {
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import reducers, { actions } from "./slice";

describe("zone reducer", () => {
  it("returns the initial state", () => {
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
    const state = zoneStateFactory();
    const zones = [zoneFactory()];

    expect(reducers(state, actions.fetchSuccess(zones))).toEqual({
      errors: {},
      items: zones,
      loading: false,
      loaded: true,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce FETCH_ZONE_ERROR", () => {
    const state = zoneStateFactory();

    expect(
      reducers(state, actions.fetchError("Could not fetch zones"))
    ).toEqual({
      errors: "Could not fetch zones",
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });
});

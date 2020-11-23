import reducers, { actions } from "./slice";

import {
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";

describe("tag reducer", () => {
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
    const state = tagStateFactory();
    const tags = [tagFactory()];

    expect(reducers(state, actions.fetchSuccess(tags))).toEqual({
      errors: {},
      items: tags,
      loading: false,
      loaded: true,
      saved: false,
      saving: false,
    });
  });

  it("reduces fetchError", () => {
    const state = tagStateFactory();

    expect(reducers(state, actions.fetchError("Could not fetch tags"))).toEqual(
      {
        errors: "Could not fetch tags",
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      }
    );
  });
});

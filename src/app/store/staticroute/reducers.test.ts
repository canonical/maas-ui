import reducers, { actions } from "./slice";

import {
  staticRoute as staticRouteFactory,
  staticRouteState as staticRouteStateFactory,
} from "testing/factories";

it("should return the initial state", () => {
  expect(reducers(undefined, { type: "" })).toEqual(
    staticRouteStateFactory({
      errors: null,
      loading: false,
      loaded: false,
      items: [],
      saved: false,
      saving: false,
    })
  );
});

it("should correctly reduce cleanup", () => {
  const initialState = staticRouteStateFactory({
    errors: { key: "Key already exists" },
    saved: true,
    saving: true,
  });
  expect(reducers(initialState, actions.cleanup())).toEqual(
    staticRouteStateFactory({
      errors: null,
      saved: false,
      saving: false,
    })
  );
});

describe("fetch reducers", () => {
  it("should correctly reduce fetchStart", () => {
    const initialState = staticRouteStateFactory({ loading: false });
    expect(reducers(initialState, actions.fetchStart())).toEqual(
      staticRouteStateFactory({
        loading: true,
      })
    );
  });

  it("should correctly reduce fetchSuccess", () => {
    const initialState = staticRouteStateFactory({
      loading: true,
      loaded: false,
      items: [],
    });
    const items = [staticRouteFactory(), staticRouteFactory()];
    expect(reducers(initialState, actions.fetchSuccess(items))).toEqual(
      staticRouteStateFactory({
        loading: false,
        loaded: true,
        items,
      })
    );
  });

  it("should correctly reduce fetchError", () => {
    const initialState = staticRouteStateFactory({
      errors: null,
      loading: true,
    });
    expect(
      reducers(initialState, actions.fetchError("Unable to list static routes"))
    ).toEqual(
      staticRouteStateFactory({
        errors: "Unable to list static routes",
        loading: false,
      })
    );
  });
});

describe("create reducers", () => {
  it("should correctly reduce createStart", () => {
    const initialState = staticRouteStateFactory({ saving: false });
    expect(reducers(initialState, actions.createStart())).toEqual(
      staticRouteStateFactory({
        saving: true,
      })
    );
  });

  it("should correctly reduce createError", () => {
    const initialState = staticRouteStateFactory({ saving: true });
    expect(
      reducers(initialState, actions.createError({ key: "Key already exists" }))
    ).toEqual(
      staticRouteStateFactory({
        errors: { key: "Key already exists" },
        saving: false,
      })
    );
  });

  it("should correctly reduce createSuccess", () => {
    const initialState = staticRouteStateFactory({
      saved: false,
      saving: true,
    });
    expect(reducers(initialState, actions.createSuccess())).toEqual(
      staticRouteStateFactory({
        saved: true,
        saving: false,
      })
    );
  });

  it("should correctly reduce createNotify", () => {
    const items = [staticRouteFactory(), staticRouteFactory()];
    const initialState = staticRouteStateFactory({ items: [items[0]] });
    expect(reducers(initialState, actions.createNotify(items[1]))).toEqual(
      staticRouteStateFactory({
        items,
      })
    );
  });
});

describe("delete reducers", () => {
  it("should correctly reduce deleteStart", () => {
    const initialState = staticRouteStateFactory({
      saved: true,
      saving: false,
    });
    expect(reducers(initialState, actions.deleteStart())).toEqual(
      staticRouteStateFactory({
        saved: false,
        saving: true,
      })
    );
  });

  it("should correctly reduce deleteError", () => {
    const initialState = staticRouteStateFactory({
      errors: null,
      saving: true,
    });
    expect(
      reducers(initialState, actions.deleteError("Could not delete"))
    ).toEqual(
      staticRouteStateFactory({
        errors: "Could not delete",
        saving: false,
      })
    );
  });

  it("should correctly reduce deleteSuccess", () => {
    const initialState = staticRouteStateFactory({ saved: false });
    expect(reducers(initialState, actions.deleteSuccess())).toEqual(
      staticRouteStateFactory({
        saved: true,
      })
    );
  });

  it("should correctly reduce deleteNotify", () => {
    const items = [staticRouteFactory(), staticRouteFactory()];
    const initialState = staticRouteStateFactory({ items });
    expect(reducers(initialState, actions.deleteNotify(items[0].id))).toEqual(
      staticRouteStateFactory({
        items: [items[1]],
      })
    );
  });
});

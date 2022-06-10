import reducers, { actions } from "./slice";

import {
  ipRange as ipRangeFactory,
  ipRangeState as ipRangeStateFactory,
} from "testing/factories";

it("should return the initial state", () => {
  expect(reducers(undefined, { type: "" })).toEqual(
    ipRangeStateFactory({
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
  const initialState = ipRangeStateFactory({
    errors: { key: "Key already exists" },
    saved: true,
    saving: true,
  });
  expect(reducers(initialState, actions.cleanup())).toEqual(
    ipRangeStateFactory({
      errors: null,
      saved: false,
      saving: false,
    })
  );
});

describe("fetch reducers", () => {
  it("should correctly reduce fetchStart", () => {
    const initialState = ipRangeStateFactory({ loading: false });
    expect(reducers(initialState, actions.fetchStart())).toEqual(
      ipRangeStateFactory({
        loading: true,
      })
    );
  });

  it("should correctly reduce fetchSuccess", () => {
    const initialState = ipRangeStateFactory({
      loading: true,
      loaded: false,
      items: [],
    });
    const items = [ipRangeFactory(), ipRangeFactory()];
    expect(reducers(initialState, actions.fetchSuccess(items))).toEqual(
      ipRangeStateFactory({
        loading: false,
        loaded: true,
        items,
      })
    );
  });

  it("should correctly reduce fetchError", () => {
    const initialState = ipRangeStateFactory({
      errors: null,
      loading: true,
    });
    expect(
      reducers(initialState, actions.fetchError("Unable to list IP ranges"))
    ).toEqual(
      ipRangeStateFactory({
        errors: "Unable to list IP ranges",
        loading: false,
      })
    );
  });
});

describe("create reducers", () => {
  it("should correctly reduce createStart", () => {
    const initialState = ipRangeStateFactory({ saving: false });
    expect(reducers(initialState, actions.createStart())).toEqual(
      ipRangeStateFactory({
        saving: true,
      })
    );
  });

  it("should correctly reduce createError", () => {
    const initialState = ipRangeStateFactory({ saving: true });
    expect(
      reducers(initialState, actions.createError({ key: "Key already exists" }))
    ).toEqual(
      ipRangeStateFactory({
        errors: { key: "Key already exists" },
        saving: false,
      })
    );
  });

  it("should correctly reduce createSuccess", () => {
    const initialState = ipRangeStateFactory({
      saved: false,
      saving: true,
    });
    expect(reducers(initialState, actions.createSuccess())).toEqual(
      ipRangeStateFactory({
        saved: true,
        saving: false,
      })
    );
  });

  it("should correctly reduce createNotify", () => {
    const items = [ipRangeFactory(), ipRangeFactory()];
    const initialState = ipRangeStateFactory({ items: [items[0]] });
    expect(reducers(initialState, actions.createNotify(items[1]))).toEqual(
      ipRangeStateFactory({
        items,
      })
    );
  });
});

describe("delete reducers", () => {
  it("should correctly reduce deleteStart", () => {
    const initialState = ipRangeStateFactory({
      saved: true,
      saving: false,
    });
    expect(reducers(initialState, actions.deleteStart())).toEqual(
      ipRangeStateFactory({
        saved: false,
        saving: true,
      })
    );
  });

  it("should correctly reduce deleteError", () => {
    const initialState = ipRangeStateFactory({
      errors: null,
      saving: true,
    });
    expect(
      reducers(initialState, actions.deleteError("Could not delete"))
    ).toEqual(
      ipRangeStateFactory({
        errors: "Could not delete",
        saving: false,
      })
    );
  });

  it("should correctly reduce deleteSuccess", () => {
    const initialState = ipRangeStateFactory({ saved: false });
    expect(reducers(initialState, actions.deleteSuccess())).toEqual(
      ipRangeStateFactory({
        saved: true,
      })
    );
  });

  it("should correctly reduce deleteNotify", () => {
    const items = [ipRangeFactory(), ipRangeFactory()];
    const initialState = ipRangeStateFactory({ items });
    expect(reducers(initialState, actions.deleteNotify(items[0].id))).toEqual(
      ipRangeStateFactory({
        items: [items[1]],
      })
    );
  });
});

describe("get reducers", () => {
  it("reduces getStart", () => {
    const ipRangeState = ipRangeStateFactory({ items: [], loading: false });

    expect(reducers(ipRangeState, actions.getStart())).toEqual(
      ipRangeStateFactory({ loading: true })
    );
  });

  it("reduces getSuccess", () => {
    const newIPRange = ipRangeFactory();
    const ipRangeState = ipRangeStateFactory({
      items: [],
      loading: true,
    });

    expect(reducers(ipRangeState, actions.getSuccess(newIPRange))).toEqual(
      ipRangeStateFactory({
        items: [newIPRange],
        loading: false,
      })
    );
  });

  it("reduces getError", () => {
    const ipRangeState = ipRangeStateFactory({ loading: true });

    expect(
      reducers(ipRangeState, actions.getError("Could not get ipRange"))
    ).toEqual(
      ipRangeStateFactory({
        errors: "Could not get ipRange",
        loading: false,
      })
    );
  });
});

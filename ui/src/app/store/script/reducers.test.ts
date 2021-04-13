import reducers from "./slice";

import {
  script as scriptFactory,
  scriptState as scriptStateFactory,
} from "testing/factories";

describe("scripts reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual(
      scriptStateFactory({
        errors: null,
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      })
    );
  });

  it("should correctly reduce script/fetchStart", () => {
    expect(
      reducers(undefined, {
        type: "script/fetchStart",
      })
    ).toEqual(
      scriptStateFactory({
        errors: null,
        items: [],
        loaded: false,
        loading: true,
      })
    );
  });

  it("should correctly reduce script/fetchError", () => {
    expect(
      reducers(undefined, {
        payload: { error: "Unable to fetch scripts" },
        type: "script/fetchError",
      })
    ).toEqual(
      scriptStateFactory({
        items: [],
        errors: { error: "Unable to fetch scripts" },
        loaded: false,
        loading: false,
      })
    );
  });

  it("should correctly reduce script/fetchSuccess", () => {
    const items = [
      scriptFactory({ name: "script 1" }),
      scriptFactory({ name: "script2" }),
    ];
    expect(
      reducers(
        scriptStateFactory({
          items: [],
          loaded: false,
          loading: true,
        }),
        {
          type: "script/fetchSuccess",
          payload: items,
        }
      )
    ).toEqual(
      scriptStateFactory({
        items,
        loaded: true,
        loading: false,
      })
    );
  });

  it("should correctly reduce script/deleteStart", () => {
    expect(
      reducers(
        {
          errors: null,
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false,
        },
        {
          type: "script/deleteStart",
        }
      )
    ).toEqual(
      scriptStateFactory({
        errors: null,
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: true,
      })
    );
  });

  it("should correctly reduce script/deleteSuccess", () => {
    expect(
      reducers(
        scriptStateFactory({
          errors: null,
          saved: false,
          saving: false,
        }),
        {
          type: "script/deleteSuccess",
          payload: null,
        }
      )
    ).toEqual(
      scriptStateFactory({
        errors: null,
        saved: true,
        saving: false,
      })
    );
  });

  it("should correctly reduce script/deleteError", () => {
    expect(
      reducers(
        {
          errors: null,
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
        },
        {
          payload: { error: "Not found" },
          type: "script/deleteError",
        }
      )
    ).toEqual(
      scriptStateFactory({
        errors: { error: "Not found" },
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      })
    );
  });
});

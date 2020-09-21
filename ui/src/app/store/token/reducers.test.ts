import {
  token as tokenFactory,
  tokenState as tokenStateFactory,
} from "testing/factories";
import reducers, { actions } from "./slice";

describe("token reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual(
      tokenStateFactory({
        errors: null,
        loading: false,
        loaded: false,
        items: [],
        saved: false,
        saving: false,
      })
    );
  });

  it("should correctly reduce fetchStart", () => {
    const initialState = tokenStateFactory({ loading: false });
    expect(reducers(initialState, actions.fetchStart())).toEqual(
      tokenStateFactory({
        loading: true,
      })
    );
  });

  it("should correctly reduce fetchSuccess", () => {
    const initialState = tokenStateFactory({
      loading: true,
      loaded: false,
      items: [],
    });
    const items = [tokenFactory(), tokenFactory()];
    expect(reducers(initialState, actions.fetchSuccess(items))).toEqual(
      tokenStateFactory({
        loading: false,
        loaded: true,
        items,
      })
    );
  });

  it("should correctly reduce fetchError", () => {
    const initialState = tokenStateFactory({
      errors: null,
      loading: true,
    });
    expect(
      reducers(initialState, actions.fetchError("Unable to list SSL keys"))
    ).toEqual(
      tokenStateFactory({
        errors: "Unable to list SSL keys",
        loading: false,
      })
    );
  });

  it("should correctly reduce createStart", () => {
    const initialState = tokenStateFactory({ saving: false });
    expect(reducers(initialState, actions.createStart())).toEqual(
      tokenStateFactory({
        saving: true,
      })
    );
  });

  it("should correctly reduce createError", () => {
    const initialState = tokenStateFactory({ saving: true });
    expect(
      reducers(initialState, actions.createError({ key: "Key already exists" }))
    ).toEqual(
      tokenStateFactory({
        errors: { key: "Key already exists" },
        saving: false,
      })
    );
  });

  it("should correctly reduce createSuccess", () => {
    const initialState = tokenStateFactory({
      saved: false,
      saving: true,
    });
    expect(reducers(initialState, actions.createSuccess())).toEqual(
      tokenStateFactory({
        saved: true,
        saving: false,
      })
    );
  });

  it("should correctly reduce deleteStart", () => {
    const initialState = tokenStateFactory({
      saved: true,
      saving: false,
    });
    expect(reducers(initialState, actions.deleteStart())).toEqual(
      tokenStateFactory({
        saved: false,
        saving: true,
      })
    );
  });

  it("should correctly reduce deleteError", () => {
    const initialState = tokenStateFactory({ errors: null, saving: true });
    expect(
      reducers(initialState, actions.deleteError("Could not delete"))
    ).toEqual(
      tokenStateFactory({
        errors: "Could not delete",
        saving: false,
      })
    );
  });

  it("should correctly reduce deleteSuccess", () => {
    const initialState = tokenStateFactory({ saved: false });
    expect(reducers(initialState, actions.deleteSuccess())).toEqual(
      tokenStateFactory({
        saved: true,
      })
    );
  });

  it("should correctly reduce createNotify", () => {
    const items = [tokenFactory(), tokenFactory()];
    const initialState = tokenStateFactory({ items: [items[0]] });
    expect(reducers(initialState, actions.createNotify(items[1]))).toEqual(
      tokenStateFactory({
        items,
      })
    );
  });

  it("should correctly reduce deleteNotify", () => {
    const items = [tokenFactory(), tokenFactory()];
    const initialState = tokenStateFactory({ items });
    expect(reducers(initialState, actions.deleteNotify(items[0].id))).toEqual(
      tokenStateFactory({
        items: [items[1]],
      })
    );
  });

  it("should correctly reduce cleanup", () => {
    const initialState = tokenStateFactory({
      errors: { key: "Key already exists" },
      saved: true,
      saving: true,
    });
    expect(reducers(initialState, actions.cleanup())).toEqual(
      tokenStateFactory({
        errors: null,
        saved: false,
        saving: false,
      })
    );
  });
});

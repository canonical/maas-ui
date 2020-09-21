import {
  sslKey as sslKeyFactory,
  sslKeyState as sslKeyStateFactory,
} from "testing/factories";
import reducers, { actions } from "./slice";

describe("sslkey reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual(sslKeyStateFactory());
  });

  it("reduces fetchStart", () => {
    const initialState = sslKeyStateFactory({ loading: false });
    expect(reducers(initialState, actions.fetchStart())).toEqual(
      sslKeyStateFactory({ loading: true })
    );
  });

  it("reduces fetchSuccess", () => {
    const initialState = sslKeyStateFactory({ loading: true });
    const items = [sslKeyFactory(), sslKeyFactory()];
    expect(reducers(initialState, actions.fetchSuccess(items))).toEqual(
      sslKeyStateFactory({ loaded: true, items })
    );
  });

  it("reduces fetchError", () => {
    const initialState = sslKeyStateFactory({ errors: null });
    expect(
      reducers(initialState, actions.fetchError("Unable to list SSL keys"))
    ).toEqual(sslKeyStateFactory({ errors: "Unable to list SSL keys" }));
  });

  it("reduces createStart", () => {
    const initialState = sslKeyStateFactory({ saving: false });
    expect(reducers(initialState, actions.createStart())).toEqual(
      sslKeyStateFactory({
        saving: true,
      })
    );
  });

  it("reduces createError", () => {
    const initialState = sslKeyStateFactory({ saving: true });
    expect(
      reducers(initialState, actions.createError({ key: "Key already exists" }))
    ).toEqual(
      sslKeyStateFactory({
        errors: { key: "Key already exists" },
      })
    );
  });

  it("reduces createSuccess", () => {
    const initialState = sslKeyStateFactory({ saved: false, saving: true });
    expect(reducers(initialState, actions.createSuccess())).toEqual(
      sslKeyStateFactory({
        saved: true,
        saving: false,
      })
    );
  });

  it("reduces deleteStart", () => {
    const initialState = sslKeyStateFactory({ saved: true });
    expect(reducers(initialState, actions.deleteStart())).toEqual(
      sslKeyStateFactory({
        saving: true,
      })
    );
  });

  it("reduces deleteError", () => {
    const initialState = sslKeyStateFactory({ saving: true });
    expect(
      reducers(initialState, actions.deleteError("Could not delete"))
    ).toEqual(
      sslKeyStateFactory({
        errors: "Could not delete",
        saving: false,
      })
    );
  });

  it("reduces deleteSuccess", () => {
    const initialState = sslKeyStateFactory({ saved: false });
    expect(reducers(initialState, actions.deleteSuccess())).toEqual(
      sslKeyStateFactory({
        saved: true,
      })
    );
  });

  it("reduces createNotify", () => {
    const initialState = sslKeyStateFactory({});
    const item = sslKeyFactory();
    expect(reducers(initialState, actions.createNotify(item))).toEqual(
      sslKeyStateFactory({
        items: [item],
      })
    );
  });

  it("reduces deleteNotify", () => {
    const items = [sslKeyFactory(), sslKeyFactory()];
    const initialState = sslKeyStateFactory({ items });
    expect(reducers(initialState, actions.deleteNotify(items[0].id))).toEqual(
      sslKeyStateFactory({
        items: [items[1]],
      })
    );
  });

  it("reduces cleanup", () => {
    const initialState = sslKeyStateFactory({
      errors: { key: "Key already exists" },
      saved: true,
      saving: true,
    });
    expect(reducers(initialState, actions.cleanup())).toEqual(
      sslKeyStateFactory({
        errors: null,
        saved: false,
        saving: false,
      })
    );
  });
});

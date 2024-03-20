import reducers, { actions } from "./slice";

import * as factory from "@/testing/factories";

describe("sslkey reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual(factory.sslKeyState());
  });

  it("reduces fetchStart", () => {
    const initialState = factory.sslKeyState({ loading: false });
    expect(reducers(initialState, actions.fetchStart())).toEqual(
      factory.sslKeyState({ loading: true })
    );
  });

  it("reduces fetchSuccess", () => {
    const initialState = factory.sslKeyState({ loading: true });
    const items = [factory.sslKey(), factory.sslKey()];
    expect(reducers(initialState, actions.fetchSuccess(items))).toEqual(
      factory.sslKeyState({ loaded: true, items })
    );
  });

  it("reduces fetchError", () => {
    const initialState = factory.sslKeyState({ errors: null });
    expect(
      reducers(initialState, actions.fetchError("Unable to list SSL keys"))
    ).toEqual(factory.sslKeyState({ errors: "Unable to list SSL keys" }));
  });

  it("reduces createStart", () => {
    const initialState = factory.sslKeyState({ saving: false });
    expect(reducers(initialState, actions.createStart())).toEqual(
      factory.sslKeyState({
        saving: true,
      })
    );
  });

  it("reduces createError", () => {
    const initialState = factory.sslKeyState({ saving: true });
    expect(
      reducers(initialState, actions.createError({ key: "Key already exists" }))
    ).toEqual(
      factory.sslKeyState({
        errors: { key: "Key already exists" },
      })
    );
  });

  it("reduces createSuccess", () => {
    const initialState = factory.sslKeyState({ saved: false, saving: true });
    expect(reducers(initialState, actions.createSuccess())).toEqual(
      factory.sslKeyState({
        saved: true,
        saving: false,
      })
    );
  });

  it("reduces deleteStart", () => {
    const initialState = factory.sslKeyState({ saved: true });
    expect(reducers(initialState, actions.deleteStart())).toEqual(
      factory.sslKeyState({
        saving: true,
      })
    );
  });

  it("reduces deleteError", () => {
    const initialState = factory.sslKeyState({ saving: true });
    expect(
      reducers(initialState, actions.deleteError("Could not delete"))
    ).toEqual(
      factory.sslKeyState({
        errors: "Could not delete",
        saving: false,
      })
    );
  });

  it("reduces deleteSuccess", () => {
    const initialState = factory.sslKeyState({ saved: false });
    expect(reducers(initialState, actions.deleteSuccess())).toEqual(
      factory.sslKeyState({
        saved: true,
      })
    );
  });

  it("reduces createNotify", () => {
    const initialState = factory.sslKeyState({});
    const item = factory.sslKey();
    expect(reducers(initialState, actions.createNotify(item))).toEqual(
      factory.sslKeyState({
        items: [item],
      })
    );
  });

  it("reduces deleteNotify", () => {
    const items = [factory.sslKey(), factory.sslKey()];
    const initialState = factory.sslKeyState({ items });
    expect(reducers(initialState, actions.deleteNotify(items[0].id))).toEqual(
      factory.sslKeyState({
        items: [items[1]],
      })
    );
  });

  it("reduces cleanup", () => {
    const initialState = factory.sslKeyState({
      errors: { key: "Key already exists" },
      saved: true,
      saving: true,
    });
    expect(reducers(initialState, actions.cleanup())).toEqual(
      factory.sslKeyState({
        errors: null,
        saved: false,
        saving: false,
      })
    );
  });
});

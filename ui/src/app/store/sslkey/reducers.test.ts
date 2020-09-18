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
    const initalState = sslKeyStateFactory({ loading: false });
    expect(reducers(initalState, actions.fetchStart())).toEqual(
      sslKeyStateFactory({ loading: true })
    );
  });

  it("reduces fetchSuccess", () => {
    const initalState = sslKeyStateFactory({ loading: true });
    const items = [sslKeyFactory(), sslKeyFactory()];
    expect(reducers(initalState, actions.fetchSuccess(items))).toEqual(
      sslKeyStateFactory({ loaded: true, items })
    );
  });

  it("reduces fetchError", () => {
    const initalState = sslKeyStateFactory({ errors: null });
    expect(
      reducers(initalState, actions.fetchError("Unable to list SSL keys"))
    ).toEqual(sslKeyStateFactory({ errors: "Unable to list SSL keys" }));
  });

  it("reduces createStart", () => {
    const initalState = sslKeyStateFactory({ saving: false });
    expect(reducers(initalState, actions.createStart())).toEqual(
      sslKeyStateFactory({
        saving: true,
      })
    );
  });

  it("reduces createError", () => {
    const initalState = sslKeyStateFactory({ saving: true });
    expect(
      reducers(initalState, actions.createError({ key: "Key already exists" }))
    ).toEqual(
      sslKeyStateFactory({
        errors: { key: "Key already exists" },
      })
    );
  });

  it("reduces createSuccess", () => {
    const initalState = sslKeyStateFactory({ saved: false, saving: true });
    expect(reducers(initalState, actions.createSuccess())).toEqual(
      sslKeyStateFactory({
        saved: true,
        saving: false,
      })
    );
  });

  it("reduces deleteStart", () => {
    const initalState = sslKeyStateFactory({ saved: true });
    expect(reducers(initalState, actions.deleteStart())).toEqual(
      sslKeyStateFactory({
        saving: true,
      })
    );
  });

  it("reduces deleteError", () => {
    const initalState = sslKeyStateFactory({ saving: true });
    expect(
      reducers(initalState, actions.deleteError("Could not delete"))
    ).toEqual(
      sslKeyStateFactory({
        errors: "Could not delete",
        saving: false,
      })
    );
  });

  it("reduces deleteSuccess", () => {
    const initalState = sslKeyStateFactory({ saved: false });
    expect(reducers(initalState, actions.deleteSuccess())).toEqual(
      sslKeyStateFactory({
        saved: true,
      })
    );
  });

  it("reduces createNotify", () => {
    const initalState = sslKeyStateFactory({});
    const item = sslKeyFactory();
    expect(reducers(initalState, actions.createNotify(item))).toEqual(
      sslKeyStateFactory({
        items: [item],
      })
    );
  });

  it("reduces deleteNotify", () => {
    const items = [sslKeyFactory(), sslKeyFactory()];
    const initalState = sslKeyStateFactory({ items });
    expect(reducers(initalState, actions.deleteNotify(items[0].id))).toEqual(
      sslKeyStateFactory({
        items: [items[1]],
      })
    );
  });

  it("reduces cleanup", () => {
    const initalState = sslKeyStateFactory({
      errors: { key: "Key already exists" },
      saved: true,
      saving: true,
    });
    expect(reducers(initalState, actions.cleanup())).toEqual(
      sslKeyStateFactory({
        errors: null,
        saved: false,
        saving: false,
      })
    );
  });
});

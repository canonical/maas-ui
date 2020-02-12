import { createStandardActions } from "./redux";

describe("createStandardActions", () => {
  it("defines a FETCH action", () => {
    const action = createStandardActions("foo");

    expect(action.fetch()).toEqual({
      meta: { method: "list", model: "foo" },
      payload: undefined,
      type: "FETCH_FOO"
    });
  });

  it("defines a CREATE action", () => {
    const action = createStandardActions("foo");

    expect(action.create({ name: "foo" })).toEqual({
      meta: { method: "create", model: "foo" },
      payload: {
        params: {
          name: "foo"
        }
      },
      type: "CREATE_FOO"
    });
  });

  it("defines an UPDATE action", () => {
    const action = createStandardActions("foo");

    expect(action.update({ name: "bar" })).toEqual({
      meta: { method: "update", model: "foo" },
      payload: {
        params: {
          name: "bar"
        }
      },
      type: "UPDATE_FOO"
    });
  });

  it("defines a DELETE action", () => {
    const action = createStandardActions("foo");

    expect(action.delete(10)).toEqual({
      meta: { method: "delete", model: "foo" },
      payload: {
        params: {
          id: 10
        }
      },
      type: "DELETE_FOO"
    });
  });

  it("defines async events", () => {
    const action = createStandardActions("foo");

    expect(action.fetch.start()).toEqual({
      type: "FETCH_FOO_START"
    });

    expect(action.update.error()).toEqual({
      type: "UPDATE_FOO_ERROR"
    });

    expect(action.delete.success()).toEqual({
      type: "DELETE_FOO_SUCCESS"
    });
  });
});

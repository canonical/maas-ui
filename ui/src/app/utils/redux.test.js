import {
  createStandardAsyncActions,
  createStandardActions,
  createStandardReducer
} from "./redux";
import { createAction } from "@reduxjs/toolkit";

describe("createStandardAsyncAction", () => {
  it("generates CRUD actions creators for start, error and success async events", () => {
    const actions = {
      fetch: createAction("FETCH_FOO"),
      create: createAction("CREATE_FOO"),
      update: createAction("UPDATE_FOO"),
      delete: createAction("DELETE_FOO")
    };

    const actionsWithAsync = createStandardAsyncActions("foo", actions);

    expect(actionsWithAsync.fetch.start()).toEqual({
      payload: undefined,
      type: "FETCH_FOO_START"
    });

    expect(actionsWithAsync.fetch.error()).toEqual({
      payload: undefined,
      type: "FETCH_FOO_ERROR"
    });

    expect(actionsWithAsync.fetch.success()).toEqual({
      payload: undefined,
      type: "FETCH_FOO_SUCCESS"
    });
  });
});

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

describe("createStandardReducer", () => {
  let actions;
  let reducer;

  beforeAll(() => {
    actions = createStandardActions("foo");
    reducer = createStandardReducer(actions);
  });

  it("should set initialState", () => {
    expect(reducer(undefined, {})).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  // fetch
  describe("fetch", () => {
    it("should set loading on fetch.start", () => {
      expect(
        reducer(undefined, {
          type: "FETCH_FOO_START"
        })
      ).toEqual({
        errors: {},
        items: [],
        loaded: false,
        loading: true,
        saved: false,
        saving: false
      });
    });

    it("should set errors and loading to false on fetch.error", () => {
      expect(
        reducer(undefined, {
          error: { message: "Could not fetch foo" },
          type: "FETCH_FOO_ERROR"
        })
      ).toEqual({
        errors: { message: "Could not fetch foo" },
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false
      });
    });

    it("should correctly reduce FETCH_FOO_SUCCESS", () => {
      expect(
        reducer(undefined, {
          type: "FETCH_FOO_SUCCESS",
          payload: [
            { id: 1, name: "foo" },
            { id: 2, name: "bar" }
          ]
        })
      ).toEqual({
        errors: {},
        loading: false,
        loaded: true,
        items: [
          { id: 1, name: "foo" },
          { id: 2, name: "bar" }
        ],
        saved: false,
        saving: false
      });
    });
  });

  describe("create", () => {
    it("should correctly reduce CREATE_FOO_START", () => {
      expect(
        reducer(
          {
            errors: {},
            items: [],
            loaded: false,
            loading: false,
            saved: true,
            saving: false
          },
          {
            type: "CREATE_FOO_START"
          }
        )
      ).toEqual({
        errors: {},
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: true
      });
    });

    it("should correctly reduce CREATE_FOO_ERROR", () => {
      expect(
        reducer(
          {
            errors: {},
            items: [],
            loaded: false,
            loading: false,
            saved: false,
            saving: true
          },
          {
            error: { name: "name already exists" },
            type: "CREATE_FOO_ERROR"
          }
        )
      ).toEqual({
        errors: { name: "name already exists" },
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false
      });
    });

    it("should correctly reduce CREATE_FOO_SUCCESS", () => {
      expect(
        reducer(
          {
            errors: {},
            items: [],
            loaded: false,
            loading: false,
            saved: true,
            saving: false
          },
          {
            type: "CREATE_FOO_SUCCESS"
          }
        )
      ).toEqual({
        errors: {},
        items: [],
        loaded: false,
        loading: false,
        saved: true,
        saving: false
      });
    });

    it("should correctly reduce CREATE_FOO_NOTIFY", () => {
      expect(
        reducer(
          {
            errors: {},
            items: [{ id: 1, name: "foo" }],
            loaded: false,
            loading: false,
            saved: false,
            saving: false
          },
          {
            payload: { id: 2, name: "bar" },
            type: "CREATE_FOO_NOTIFY"
          }
        )
      ).toEqual({
        errors: {},
        items: [
          { id: 1, name: "foo" },
          { id: 2, name: "bar" }
        ],
        loaded: false,
        loading: false,
        saved: false,
        saving: false
      });
    });
  });

  describe("update", () => {
    it("should correctly reduce UPDATE_FOO_START", () => {
      expect(
        reducer(
          {
            errors: {},
            items: [],
            loaded: false,
            loading: false,
            saved: true,
            saving: false
          },
          {
            type: "UPDATE_FOO_START"
          }
        )
      ).toEqual({
        errors: {},
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: true
      });
    });

    it("should correctly reduce UPDATE_FOO_ERROR", () => {
      expect(
        reducer(
          {
            errors: {},
            items: [],
            loaded: false,
            loading: false,
            saved: false,
            saving: true
          },
          {
            error: { name: "name already exists" },
            type: "UPDATE_FOO_ERROR"
          }
        )
      ).toEqual({
        errors: { name: "name already exists" },
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false
      });
    });

    it("should correctly reduce UPDATE_FOO_NOTIFY", () => {
      expect(
        reducer(
          {
            errors: {},
            items: [
              { id: 1, name: "admin" },
              { id: 2, name: "user1" }
            ],
            loaded: false,
            loading: false,
            saved: false,
            saving: false
          },
          {
            payload: {
              id: 1,
              name: "kangaroo"
            },
            type: "UPDATE_FOO_NOTIFY"
          }
        )
      ).toEqual({
        errors: {},
        items: [
          { id: 1, name: "kangaroo" },
          { id: 2, name: "user1" }
        ],
        loaded: false,
        loading: false,
        saved: false,
        saving: false
      });
    });
  });

  describe("delete", () => {
    it("should correctly reduce DELETE_FOO_START", () => {
      expect(
        reducer(
          {
            errors: {},
            items: [],
            loaded: false,
            loading: false,
            saved: true,
            saving: false
          },
          {
            type: "DELETE_FOO_START"
          }
        )
      ).toEqual({
        errors: {},
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: true
      });
    });

    it("should correctly reduce DELETE_FOO_ERROR", () => {
      expect(
        reducer(
          {
            errors: {},
            items: [],
            loaded: false,
            loading: false,
            saved: false,
            saving: true
          },
          {
            error: "Could not delete",
            type: "DELETE_FOO_ERROR"
          }
        )
      ).toEqual({
        errors: "Could not delete",
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false
      });
    });

    it("should correctly reduce DELETE_FOO_NOTIFY", () => {
      expect(
        reducer(
          {
            errors: {},
            items: [
              { id: 1, name: "admin" },
              { id: 2, name: "user1" }
            ],
            loaded: false,
            loading: false,
            saved: false,
            saving: false
          },
          {
            payload: 2,
            type: "DELETE_FOO_NOTIFY"
          }
        )
      ).toEqual({
        errors: {},
        items: [{ id: 1, name: "admin" }],
        loaded: false,
        loading: false,
        saved: false,
        saving: false
      });
    });
  });

  describe("cleanup", () => {
    it("should correctly reduce CLEANUP_FOO", () => {
      expect(
        reducer(
          {
            errors: { name: "name already exists" },
            items: [],
            loaded: false,
            loading: false,
            saved: true,
            saving: true
          },
          {
            type: "CLEANUP_FOO"
          }
        )
      ).toEqual({
        errors: {},
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false
      });
    });
  });
});

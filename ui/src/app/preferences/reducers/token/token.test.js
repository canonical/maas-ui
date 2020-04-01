import token from "./token";

describe("token reducer", () => {
  it("should return the initial state", () => {
    expect(token(undefined, {})).toEqual({
      errors: null,
      loading: false,
      loaded: false,
      items: [],
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce FETCH_TOKEN_START", () => {
    expect(
      token(undefined, {
        type: "FETCH_TOKEN_START",
      })
    ).toEqual({
      errors: null,
      loading: true,
      loaded: false,
      items: [],
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce FETCH_TOKEN_SUCCESS", () => {
    expect(
      token(
        {
          errors: null,
          loading: true,
          loaded: false,
          items: [],
          saved: false,
          saving: false,
        },
        {
          type: "FETCH_TOKEN_SUCCESS",
          payload: [
            { id: 1, key: "ssh-rsa aabb" },
            { id: 2, key: "ssh-rsa ccdd" },
          ],
        }
      )
    ).toEqual({
      errors: null,
      loading: false,
      loaded: true,
      items: [
        { id: 1, key: "ssh-rsa aabb" },
        { id: 2, key: "ssh-rsa ccdd" },
      ],
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce FETCH_TOKEN_ERROR", () => {
    expect(
      token(undefined, {
        type: "FETCH_TOKEN_ERROR",
        error: "Unable to list SSL keys",
      })
    ).toEqual({
      errors: "Unable to list SSL keys",
      loading: false,
      loaded: false,
      items: [],
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce CREATE_TOKEN_START", () => {
    expect(
      token(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
        },
        {
          type: "CREATE_TOKEN_START",
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: true,
    });
  });

  it("should correctly reduce CREATE_TOKEN_ERROR", () => {
    expect(
      token(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
        },
        {
          error: { key: "Key already exists" },
          type: "CREATE_TOKEN_ERROR",
        }
      )
    ).toEqual({
      errors: { key: "Key already exists" },
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce CREATE_TOKEN_SUCCESS", () => {
    expect(
      token(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
        },
        {
          type: "CREATE_TOKEN_SUCCESS",
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: true,
      saving: false,
    });
  });

  it("should correctly reduce DELETE_TOKEN_START", () => {
    expect(
      token(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false,
        },
        {
          type: "DELETE_TOKEN_START",
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: true,
    });
  });

  it("should correctly reduce DELETE_TOKEN_ERROR", () => {
    expect(
      token(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
        },
        {
          error: "Could not delete",
          type: "DELETE_TOKEN_ERROR",
        }
      )
    ).toEqual({
      errors: "Could not delete",
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce DELETE_TOKEN_SUCCESS", () => {
    expect(
      token(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true,
          saved: false,
          saving: false,
        },
        {
          type: "DELETE_TOKEN_SUCCESS",
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loading: true,
      loaded: false,
      saved: true,
      saving: false,
    });
  });

  it("should correctly reduce CREATE_TOKEN_NOTIFY", () => {
    expect(
      token(
        {
          auth: {},
          errors: {},
          items: [{ id: 1, key: "ssh-rsa aabb" }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
        },
        {
          payload: { id: 2, key: "ssh-rsa ccdd" },
          type: "CREATE_TOKEN_NOTIFY",
        }
      )
    ).toEqual({
      auth: {},
      errors: {},
      items: [
        { id: 1, key: "ssh-rsa aabb" },
        { id: 2, key: "ssh-rsa ccdd" },
      ],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce DELETE_TOKEN_NOTIFY", () => {
    expect(
      token(
        {
          errors: {},
          items: [
            { id: 1, key: "ssh-rsa aabb" },
            { id: 2, key: "ssh-rsa ccdd" },
          ],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
        },
        {
          payload: 2,
          type: "DELETE_TOKEN_NOTIFY",
        }
      )
    ).toEqual({
      errors: {},
      items: [{ id: 1, key: "ssh-rsa aabb" }],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce CLEANUP_TOKEN", () => {
    expect(
      token(
        {
          errors: { key: "Key already exists" },
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: true,
        },
        {
          type: "CLEANUP_TOKEN",
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });
});

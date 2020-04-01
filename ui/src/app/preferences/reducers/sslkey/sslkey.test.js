import sslkey from "./sslkey";

describe("sslkey reducer", () => {
  it("should return the initial state", () => {
    expect(sslkey(undefined, {})).toEqual({
      errors: null,
      loading: false,
      loaded: false,
      items: [],
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce FETCH_SSLKEY_START", () => {
    expect(
      sslkey(undefined, {
        type: "FETCH_SSLKEY_START",
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

  it("should correctly reduce FETCH_SSLKEY_SUCCESS", () => {
    expect(
      sslkey(
        {
          errors: null,
          loading: true,
          loaded: false,
          items: [],
          saved: false,
          saving: false,
        },
        {
          type: "FETCH_SSLKEY_SUCCESS",
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

  it("should correctly reduce FETCH_SSLKEY_ERROR", () => {
    expect(
      sslkey(undefined, {
        type: "FETCH_SSLKEY_ERROR",
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

  it("should correctly reduce CREATE_SSLKEY_START", () => {
    expect(
      sslkey(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
        },
        {
          type: "CREATE_SSLKEY_START",
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

  it("should correctly reduce CREATE_SSLKEY_ERROR", () => {
    expect(
      sslkey(
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
          type: "CREATE_SSLKEY_ERROR",
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

  it("should correctly reduce CREATE_SSLKEY_SUCCESS", () => {
    expect(
      sslkey(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
        },
        {
          type: "CREATE_SSLKEY_SUCCESS",
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

  it("should correctly reduce DELETE_SSLKEY_START", () => {
    expect(
      sslkey(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false,
        },
        {
          type: "DELETE_SSLKEY_START",
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

  it("should correctly reduce DELETE_SSLKEY_ERROR", () => {
    expect(
      sslkey(
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
          type: "DELETE_SSLKEY_ERROR",
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

  it("should correctly reduce DELETE_SSLKEY_SUCCESS", () => {
    expect(
      sslkey(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true,
          saved: false,
          saving: false,
        },
        {
          type: "DELETE_SSLKEY_SUCCESS",
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

  it("should correctly reduce CREATE_SSLKEY_NOTIFY", () => {
    expect(
      sslkey(
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
          type: "CREATE_SSLKEY_NOTIFY",
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

  it("should correctly reduce DELETE_SSLKEY_NOTIFY", () => {
    expect(
      sslkey(
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
          type: "DELETE_SSLKEY_NOTIFY",
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

  it("should correctly reduce CLEANUP_SSLKEY", () => {
    expect(
      sslkey(
        {
          errors: { key: "Key already exists" },
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: true,
        },
        {
          type: "CLEANUP_SSLKEY",
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

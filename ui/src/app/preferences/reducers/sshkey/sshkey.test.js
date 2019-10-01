import sshkey from "./sshkey";

describe("sshkey reducer", () => {
  it("should return the initial state", () => {
    expect(sshkey(undefined, {})).toEqual({
      errors: null,
      loading: false,
      loaded: false,
      items: [],
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce FETCH_SSHKEY_START", () => {
    expect(
      sshkey(undefined, {
        type: "FETCH_SSHKEY_START"
      })
    ).toEqual({
      errors: null,
      loading: true,
      loaded: false,
      items: [],
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce FETCH_SSHKEY_SUCCESS", () => {
    expect(
      sshkey(
        {
          errors: null,
          loading: true,
          loaded: false,
          items: [],
          saved: false,
          saving: false
        },
        {
          type: "FETCH_SSHKEY_SUCCESS",
          payload: [
            { id: 1, key: "ssh-rsa aabb" },
            { id: 2, key: "ssh-rsa ccdd" }
          ]
        }
      )
    ).toEqual({
      errors: null,
      loading: false,
      loaded: true,
      items: [{ id: 1, key: "ssh-rsa aabb" }, { id: 2, key: "ssh-rsa ccdd" }],
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce FETCH_SSHKEY_ERROR", () => {
    expect(
      sshkey(undefined, {
        type: "FETCH_SSHKEY_ERROR",
        error: "Unable to list SSH keys"
      })
    ).toEqual({
      errors: "Unable to list SSH keys",
      loading: false,
      loaded: false,
      items: [],
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce CREATE_SSHKEY_START", () => {
    expect(
      sshkey(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: false
        },
        {
          type: "CREATE_SSHKEY_START"
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

  it("should correctly reduce CREATE_SSHKEY_ERROR", () => {
    expect(
      sshkey(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true
        },
        {
          error: { auth_id: "User not found" },
          type: "CREATE_SSHKEY_ERROR"
        }
      )
    ).toEqual({
      errors: { auth_id: "User not found" },
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce CREATE_SSHKEY_SUCCESS", () => {
    expect(
      sshkey(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true
        },
        {
          type: "CREATE_SSHKEY_SUCCESS"
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

  it("should correctly reduce IMPORT_SSHKEY_START", () => {
    expect(
      sshkey(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: false
        },
        {
          type: "IMPORT_SSHKEY_START"
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

  it("should correctly reduce IMPORT_SSHKEY_ERROR", () => {
    expect(
      sshkey(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true
        },
        {
          error: { auth_id: "User not found" },
          type: "IMPORT_SSHKEY_ERROR"
        }
      )
    ).toEqual({
      errors: { auth_id: "User not found" },
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce IMPORT_SSHKEY_SUCCESS", () => {
    expect(
      sshkey(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true
        },
        {
          type: "IMPORT_SSHKEY_SUCCESS"
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

  it("should correctly reduce CREATE_SSHKEY_NOTIFY", () => {
    expect(
      sshkey(
        {
          auth: {},
          errors: {},
          items: [{ id: 1, key: "ssh-rsa aabb" }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false
        },
        {
          payload: { id: 2, key: "ssh-rsa ccdd" },
          type: "CREATE_SSHKEY_NOTIFY"
        }
      )
    ).toEqual({
      auth: {},
      errors: {},
      items: [{ id: 1, key: "ssh-rsa aabb" }, { id: 2, key: "ssh-rsa ccdd" }],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce CLEANUP_SSHKEY", () => {
    expect(
      sshkey(
        {
          errors: { auth_id: "User not found" },
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: true
        },
        {
          type: "CLEANUP_SSHKEY"
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

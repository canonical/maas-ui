import sshkey from "./sshkey";

describe("sshkey reducer", () => {
  it("should return the initial state", () => {
    expect(sshkey(undefined, {})).toEqual({
      errors: null,
      loading: false,
      loaded: false,
      items: []
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
      items: []
    });
  });

  it("should correctly reduce FETCH_SSHKEY_SUCCESS", () => {
    expect(
      sshkey(
        {
          errors: null,
          loading: true,
          loaded: false,
          items: []
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
      items: [{ id: 1, key: "ssh-rsa aabb" }, { id: 2, key: "ssh-rsa ccdd" }]
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
      items: []
    });
  });
});

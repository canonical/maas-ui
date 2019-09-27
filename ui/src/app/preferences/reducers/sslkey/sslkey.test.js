import sslkey from "./sslkey";

describe("sslkey reducer", () => {
  it("should return the initial state", () => {
    expect(sslkey(undefined, {})).toEqual({
      errors: null,
      loading: false,
      loaded: false,
      items: []
    });
  });

  it("should correctly reduce FETCH_SSLKEY_START", () => {
    expect(
      sslkey(undefined, {
        type: "FETCH_SSLKEY_START"
      })
    ).toEqual({
      errors: null,
      loading: true,
      loaded: false,
      items: []
    });
  });

  it("should correctly reduce FETCH_SSLKEY_SUCCESS", () => {
    expect(
      sslkey(
        {
          errors: null,
          loading: true,
          loaded: false,
          items: []
        },
        {
          type: "FETCH_SSLKEY_SUCCESS",
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

  it("should correctly reduce FETCH_SSLKEY_ERROR", () => {
    expect(
      sslkey(undefined, {
        type: "FETCH_SSLKEY_ERROR",
        error: "Unable to list SSL keys"
      })
    ).toEqual({
      errors: "Unable to list SSL keys",
      loading: false,
      loaded: false,
      items: []
    });
  });
});

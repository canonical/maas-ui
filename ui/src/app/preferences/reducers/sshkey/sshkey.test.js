import sshkey from "./sshkey";

describe("sshkey reducer", () => {
  it("should return the initial state", () => {
    expect(sshkey(undefined, {})).toEqual({
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
      loading: true,
      loaded: false,
      items: []
    });
  });

  it("should correctly reduce FETCH_SSHKEY_SUCCESS", () => {
    expect(
      sshkey(
        {
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
      loading: false,
      loaded: true,
      items: [{ id: 1, key: "ssh-rsa aabb" }, { id: 2, key: "ssh-rsa ccdd" }]
    });
  });
});

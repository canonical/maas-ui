import sshkey from "./sshkey";

describe("sshkey actions", () => {
  it("should handle fetching SSH keys", () => {
    expect(sshkey.fetch()).toEqual({
      type: "FETCH_SSHKEY",
      meta: {
        model: "sshkey",
        method: "list"
      }
    });
  });

  it("can handle creating SSH keys", () => {
    expect(sshkey.create({ key: "id-rsa..." })).toEqual({
      type: "CREATE_SSHKEY",
      meta: {
        model: "sshkey",
        method: "create"
      },
      payload: {
        params: {
          key: "id-rsa..."
        }
      }
    });
  });

  it("can handle importing SSH keys", () => {
    expect(sshkey.import({ auth_id: "wallaroo", protocol: "lp" })).toEqual({
      type: "IMPORT_SSHKEY",
      meta: {
        model: "sshkey",
        method: "import_keys"
      },
      payload: {
        params: {
          auth_id: "wallaroo",
          protocol: "lp"
        }
      }
    });
  });

  it("can handle deleting SSH keys", () => {
    expect(sshkey.delete(808)).toEqual({
      type: "DELETE_SSHKEY",
      meta: {
        model: "sshkey",
        method: "delete"
      },
      payload: {
        params: {
          id: 808
        }
      }
    });
  });

  it("can clean up", () => {
    expect(sshkey.cleanup()).toEqual({
      type: "CLEANUP_SSHKEY"
    });
  });
});

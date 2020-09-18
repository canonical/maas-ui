import { actions } from "./slice";

describe("sshkey actions", () => {
  it("should handle fetching SSH keys", () => {
    expect(actions.fetch()).toEqual({
      type: "sshkey/fetch",
      meta: {
        model: "sshkey",
        method: "list",
      },
      payload: null,
    });
  });

  it("can handle creating SSH keys", () => {
    expect(actions.create({ key: "id-rsa..." })).toEqual({
      type: "sshkey/create",
      meta: {
        model: "sshkey",
        method: "create",
      },
      payload: {
        params: {
          key: "id-rsa...",
        },
      },
    });
  });

  it("can handle importing SSH keys", () => {
    expect(actions.import({ auth_id: "wallaroo", protocol: "lp" })).toEqual({
      type: "sshkey/import",
      meta: {
        model: "sshkey",
        method: "import_keys",
      },
      payload: {
        params: {
          auth_id: "wallaroo",
          protocol: "lp",
        },
      },
    });
  });

  it("can handle deleting SSH keys", () => {
    expect(actions.delete(808)).toEqual({
      type: "sshkey/delete",
      meta: {
        model: "sshkey",
        method: "delete",
      },
      payload: {
        params: {
          id: 808,
        },
      },
    });
  });

  it("can clean up", () => {
    expect(actions.cleanup()).toEqual({
      type: "sshkey/cleanup",
    });
  });
});

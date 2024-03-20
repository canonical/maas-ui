import reducers, { actions } from "./slice";

import * as factory from "@/testing/factories";

describe("sshkey reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual(factory.sshKeyState());
  });

  it("should correctly reduce fetchStart", () => {
    expect(
      reducers(factory.sshKeyState({ loading: false }), actions.fetchStart())
    ).toEqual(
      factory.sshKeyState({
        loading: true,
      })
    );
  });

  it("should correctly reduce fetchSuccess", () => {
    const items = [factory.sshKey(), factory.sshKey()];
    expect(
      reducers(
        factory.sshKeyState({
          items: [],
          loading: true,
          loaded: false,
        }),
        actions.fetchSuccess(items)
      )
    ).toEqual(
      factory.sshKeyState({
        items,
        loading: false,
        loaded: true,
      })
    );
  });

  it("should correctly reduce fetchError", () => {
    expect(
      reducers(
        factory.sshKeyState({ errors: null }),
        actions.fetchError("Unable to list SSH keys")
      )
    ).toEqual(
      factory.sshKeyState({
        errors: "Unable to list SSH keys",
      })
    );
  });

  it("should correctly reduce createStart", () => {
    expect(
      reducers(
        factory.sshKeyState({
          saving: false,
        }),
        actions.createStart()
      )
    ).toEqual(
      factory.sshKeyState({
        saving: true,
      })
    );
  });

  it("should correctly reduce createError", () => {
    expect(
      reducers(
        factory.sshKeyState({
          errors: null,
          saving: true,
        }),
        actions.createError({ auth_id: "User not found" })
      )
    ).toEqual(
      factory.sshKeyState({
        errors: { auth_id: "User not found" },
        saving: false,
      })
    );
  });

  it("should correctly reduce createSuccess", () => {
    expect(
      reducers(
        factory.sshKeyState({
          saved: false,
          saving: true,
        }),
        actions.createSuccess()
      )
    ).toEqual(
      factory.sshKeyState({
        saved: true,
        saving: false,
      })
    );
  });

  it("should correctly reduce importStart", () => {
    expect(
      reducers(
        factory.sshKeyState({
          saving: false,
        }),
        actions.importStart()
      )
    ).toEqual(
      factory.sshKeyState({
        saving: true,
      })
    );
  });

  it("should correctly reduce importError", () => {
    expect(
      reducers(
        factory.sshKeyState({
          errors: {},
          saving: true,
        }),
        actions.importError({ auth_id: "User not found" })
      )
    ).toEqual(
      factory.sshKeyState({
        errors: { auth_id: "User not found" },
        saving: false,
      })
    );
  });

  it("should correctly reduce importSuccess", () => {
    expect(
      reducers(
        factory.sshKeyState({
          saved: false,
          saving: true,
        }),
        actions.importSuccess()
      )
    ).toEqual(
      factory.sshKeyState({
        saved: true,
        saving: false,
      })
    );
  });

  it("should correctly reduce createNotify", () => {
    const items = [factory.sshKey(), factory.sshKey()];
    expect(
      reducers(
        factory.sshKeyState({
          items: [items[0]],
        }),
        actions.createNotify(items[1])
      )
    ).toEqual(
      factory.sshKeyState({
        items,
      })
    );
  });

  it("should correctly reduce deleteStart", () => {
    expect(
      reducers(
        factory.sshKeyState({
          saved: true,
          saving: false,
        }),
        actions.deleteStart()
      )
    ).toEqual(
      factory.sshKeyState({
        saved: false,
        saving: true,
      })
    );
  });

  it("should correctly reduce deleteError", () => {
    expect(
      reducers(
        factory.sshKeyState({
          errors: {},
          saving: true,
        }),
        actions.deleteError("Could not delete")
      )
    ).toEqual(
      factory.sshKeyState({
        errors: "Could not delete",
        saving: false,
      })
    );
  });

  it("should correctly reduce deleteSuccess", () => {
    expect(
      reducers(
        factory.sshKeyState({
          loading: true,
          saved: false,
        }),
        actions.deleteSuccess()
      )
    ).toEqual(
      factory.sshKeyState({
        loading: true,
        saved: true,
      })
    );
  });

  it("should correctly reduce deleteNotify", () => {
    const items = [factory.sshKey(), factory.sshKey()];
    expect(
      reducers(
        factory.sshKeyState({
          items,
        }),
        actions.deleteNotify(items[1].id)
      )
    ).toEqual(
      factory.sshKeyState({
        items: [items[0]],
      })
    );
  });

  it("should correctly reduce CLEANUP", () => {
    expect(
      reducers(
        factory.sshKeyState({
          errors: { auth_id: "User not found" },
          saved: true,
          saving: true,
        }),
        actions.cleanup()
      )
    ).toEqual(
      factory.sshKeyState({
        errors: null,
        saved: false,
        saving: false,
      })
    );
  });
});

import {
  sshKey as sshKeyFactory,
  sshKeyState as sshKeyStateFactory,
} from "testing/factories";
import reducers, { actions } from "./slice";

describe("sshkey reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual(sshKeyStateFactory());
  });

  it("should correctly reduce fetchStart", () => {
    expect(
      reducers(sshKeyStateFactory({ loading: false }), actions.fetchStart())
    ).toEqual(
      sshKeyStateFactory({
        loading: true,
      })
    );
  });

  it("should correctly reduce fetchSuccess", () => {
    const items = [sshKeyFactory(), sshKeyFactory()];
    expect(
      reducers(
        sshKeyStateFactory({
          items: [],
          loading: true,
          loaded: false,
        }),
        actions.fetchSuccess(items)
      )
    ).toEqual(
      sshKeyStateFactory({
        items,
        loading: false,
        loaded: true,
      })
    );
  });

  it("should correctly reduce fetchError", () => {
    expect(
      reducers(
        sshKeyStateFactory({ errors: null }),
        actions.fetchError("Unable to list SSH keys")
      )
    ).toEqual(
      sshKeyStateFactory({
        errors: "Unable to list SSH keys",
      })
    );
  });

  it("should correctly reduce createStart", () => {
    expect(
      reducers(
        sshKeyStateFactory({
          saving: false,
        }),
        actions.createStart()
      )
    ).toEqual(
      sshKeyStateFactory({
        saving: true,
      })
    );
  });

  it("should correctly reduce createError", () => {
    expect(
      reducers(
        sshKeyStateFactory({
          errors: null,
          saving: true,
        }),
        actions.createError({ auth_id: "User not found" })
      )
    ).toEqual(
      sshKeyStateFactory({
        errors: { auth_id: "User not found" },
        saving: false,
      })
    );
  });

  it("should correctly reduce createSuccess", () => {
    expect(
      reducers(
        sshKeyStateFactory({
          saved: false,
          saving: true,
        }),
        actions.createSuccess()
      )
    ).toEqual(
      sshKeyStateFactory({
        saved: true,
        saving: false,
      })
    );
  });

  it("should correctly reduce importStart", () => {
    expect(
      reducers(
        sshKeyStateFactory({
          saving: false,
        }),
        actions.importStart()
      )
    ).toEqual(
      sshKeyStateFactory({
        saving: true,
      })
    );
  });

  it("should correctly reduce importError", () => {
    expect(
      reducers(
        sshKeyStateFactory({
          errors: {},
          saving: true,
        }),
        actions.importError({ auth_id: "User not found" })
      )
    ).toEqual(
      sshKeyStateFactory({
        errors: { auth_id: "User not found" },
        saving: false,
      })
    );
  });

  it("should correctly reduce importSuccess", () => {
    expect(
      reducers(
        sshKeyStateFactory({
          saved: false,
          saving: true,
        }),
        actions.importSuccess()
      )
    ).toEqual(
      sshKeyStateFactory({
        saved: true,
        saving: false,
      })
    );
  });

  it("should correctly reduce createNotify", () => {
    const items = [sshKeyFactory(), sshKeyFactory()];
    expect(
      reducers(
        sshKeyStateFactory({
          items: [items[0]],
        }),
        actions.createNotify(items[1])
      )
    ).toEqual(
      sshKeyStateFactory({
        items,
      })
    );
  });

  it("should correctly reduce deleteStart", () => {
    expect(
      reducers(
        sshKeyStateFactory({
          saved: true,
          saving: false,
        }),
        actions.deleteStart()
      )
    ).toEqual(
      sshKeyStateFactory({
        saved: false,
        saving: true,
      })
    );
  });

  it("should correctly reduce deleteError", () => {
    expect(
      reducers(
        sshKeyStateFactory({
          errors: {},
          saving: true,
        }),
        actions.deleteError("Could not delete")
      )
    ).toEqual(
      sshKeyStateFactory({
        errors: "Could not delete",
        saving: false,
      })
    );
  });

  it("should correctly reduce deleteSuccess", () => {
    expect(
      reducers(
        sshKeyStateFactory({
          loading: true,
          saved: false,
        }),
        actions.deleteSuccess()
      )
    ).toEqual(
      sshKeyStateFactory({
        loading: true,
        saved: true,
      })
    );
  });

  it("should correctly reduce deleteNotify", () => {
    const items = [sshKeyFactory(), sshKeyFactory()];
    expect(
      reducers(
        sshKeyStateFactory({
          items,
        }),
        actions.deleteNotify(items[1].id)
      )
    ).toEqual(
      sshKeyStateFactory({
        items: [items[0]],
      })
    );
  });

  it("should correctly reduce CLEANUP", () => {
    expect(
      reducers(
        sshKeyStateFactory({
          errors: { auth_id: "User not found" },
          saved: true,
          saving: true,
        }),
        actions.cleanup()
      )
    ).toEqual(
      sshKeyStateFactory({
        errors: null,
        saved: false,
        saving: false,
      })
    );
  });
});

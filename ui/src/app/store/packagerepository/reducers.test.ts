import {
  packageRepository as packageRepositoryFactory,
  packageRepositoryState as packageRepositoryStateFactory,
} from "testing/factories";
import reducers, { actions } from "./slice";

describe("packagerepository reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual(
      packageRepositoryStateFactory()
    );
  });

  it("reduces fetchStart", () => {
    expect(
      reducers(
        packageRepositoryStateFactory({ loading: false }),
        actions.fetchStart()
      )
    ).toEqual(
      packageRepositoryStateFactory({
        loading: true,
      })
    );
  });

  it("reduces fetchSuccess", () => {
    const items = [packageRepositoryFactory(), packageRepositoryFactory()];
    expect(
      reducers(
        packageRepositoryStateFactory({
          items: [],
          loaded: false,
          loading: true,
        }),
        actions.fetchSuccess(items)
      )
    ).toEqual(
      packageRepositoryStateFactory({
        items,
        loaded: true,
        loading: false,
      })
    );
  });

  it("reduces createStart", () => {
    expect(
      reducers(
        packageRepositoryStateFactory({
          saved: true,
          saving: false,
        }),
        actions.createStart()
      )
    ).toEqual(
      packageRepositoryStateFactory({
        saved: false,
        saving: true,
      })
    );
  });

  it("reduces createSuccess", () => {
    expect(
      reducers(
        packageRepositoryStateFactory({
          errors: { name: "Name already exists" },
          saved: false,
          saving: true,
        }),
        actions.createSuccess()
      )
    ).toEqual(
      packageRepositoryStateFactory({
        errors: null,
        saved: true,
        saving: false,
      })
    );
  });

  it("reduces createError", () => {
    expect(
      reducers(
        packageRepositoryStateFactory({
          errors: null,
          saving: true,
        }),
        actions.createError("Could not create repository")
      )
    ).toEqual(
      packageRepositoryStateFactory({
        errors: "Could not create repository",
        saving: false,
      })
    );
  });

  it("reduces createNotify", () => {
    const items = [packageRepositoryFactory(), packageRepositoryFactory()];
    expect(
      reducers(
        packageRepositoryStateFactory({
          items: [items[0]],
        }),
        actions.createNotify(items[1])
      )
    ).toEqual(
      packageRepositoryStateFactory({
        items,
      })
    );
  });

  it("reduces updateStart", () => {
    expect(
      reducers(
        packageRepositoryStateFactory({
          saved: true,
          saving: false,
        }),
        actions.updateStart()
      )
    ).toEqual(
      packageRepositoryStateFactory({
        saved: false,
        saving: true,
      })
    );
  });

  it("reduces updateSuccess", () => {
    expect(
      reducers(
        packageRepositoryStateFactory({
          errors: { name: "Name already exists" },
          saved: false,
          saving: true,
        }),
        actions.updateSuccess()
      )
    ).toEqual(
      packageRepositoryStateFactory({
        errors: null,
        saved: true,
        saving: false,
      })
    );
  });

  it("reduces updateError", () => {
    expect(
      reducers(
        packageRepositoryStateFactory({
          errors: null,
          saving: true,
        }),
        actions.updateError("Could not update repository")
      )
    ).toEqual(
      packageRepositoryStateFactory({
        errors: "Could not update repository",
        saving: false,
      })
    );
  });

  it("reduces updateNotify", () => {
    const items = [packageRepositoryFactory(), packageRepositoryFactory()];
    const updated = { ...items[1], name: "newName" };
    expect(
      reducers(
        packageRepositoryStateFactory({
          items,
        }),
        actions.updateNotify(updated)
      )
    ).toEqual(
      packageRepositoryStateFactory({
        items: [items[0], updated],
      })
    );
  });

  it("reduces deleteStart", () => {
    expect(
      reducers(
        packageRepositoryStateFactory({
          saved: true,
          saving: false,
        }),
        actions.deleteStart()
      )
    ).toEqual(
      packageRepositoryStateFactory({
        saved: false,
        saving: true,
      })
    );
  });

  it("reduces deleteSuccess", () => {
    expect(
      reducers(
        packageRepositoryStateFactory({
          errors: { name: "Name already exists" },
          saved: false,
          saving: true,
        }),
        actions.deleteSuccess()
      )
    ).toEqual(
      packageRepositoryStateFactory({
        errors: null,
        saved: true,
        saving: false,
      })
    );
  });

  it("reduces deleteError", () => {
    expect(
      reducers(
        packageRepositoryStateFactory({
          errors: null,
          saving: true,
        }),
        actions.deleteError("Could not delete repository")
      )
    ).toEqual(
      packageRepositoryStateFactory({
        errors: "Could not delete repository",
        saving: false,
      })
    );
  });

  it("reduces deleteNotify", () => {
    const items = [packageRepositoryFactory(), packageRepositoryFactory()];
    expect(
      reducers(
        packageRepositoryStateFactory({
          items,
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
        }),
        actions.deleteNotify(items[1].id)
      )
    ).toEqual(
      packageRepositoryStateFactory({
        items: [items[0]],
      })
    );
  });
});

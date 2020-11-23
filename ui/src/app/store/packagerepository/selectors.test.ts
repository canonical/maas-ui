import packagerepository from "./selectors";

import {
  packageRepository as packageRepositoryFactory,
  packageRepositoryState as packageRepositoryStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("packagerepository selectors", () => {
  it("can get repository items", () => {
    const items = [packageRepositoryFactory(), packageRepositoryFactory()];
    const state = rootStateFactory({
      packagerepository: packageRepositoryStateFactory({
        items,
      }),
    });
    expect(packagerepository.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      packagerepository: packageRepositoryStateFactory({
        loading: true,
      }),
    });
    expect(packagerepository.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      packagerepository: packageRepositoryStateFactory({
        loaded: true,
      }),
    });
    expect(packagerepository.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = rootStateFactory({
      packagerepository: packageRepositoryStateFactory({
        saving: true,
      }),
    });
    expect(packagerepository.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = rootStateFactory({
      packagerepository: packageRepositoryStateFactory({
        saved: true,
      }),
    });
    expect(packagerepository.saved(state)).toEqual(true);
  });

  it("can get packagerepository errors", () => {
    const state = rootStateFactory({
      packagerepository: packageRepositoryStateFactory({
        errors: { name: "Name already exists" },
      }),
    });
    expect(packagerepository.errors(state)).toStrictEqual({
      name: "Name already exists",
    });
  });

  it("can get the count", () => {
    const state = rootStateFactory({
      packagerepository: packageRepositoryStateFactory({
        loading: true,
        items: [packageRepositoryFactory(), packageRepositoryFactory()],
      }),
    });
    expect(packagerepository.count(state)).toEqual(2);
  });

  it("can get a repository by id", () => {
    const items = [
      packageRepositoryFactory({ id: 101 }),
      packageRepositoryFactory({ id: 123 }),
    ];
    const state = rootStateFactory({
      packagerepository: packageRepositoryStateFactory({
        loading: true,
        items,
      }),
    });
    expect(packagerepository.getById(state, 101)).toStrictEqual(items[0]);
  });

  it("can search items", () => {
    const items = [
      packageRepositoryFactory({ name: "main_archive" }),
      packageRepositoryFactory({ url: "www.main.com" }),
      packageRepositoryFactory(),
    ];
    const state = rootStateFactory({
      packagerepository: packageRepositoryStateFactory({
        items,
      }),
    });
    expect(packagerepository.search(state, "main")).toEqual([
      items[0],
      items[1],
    ]);
  });

  it("can search by display name", () => {
    const items = [
      packageRepositoryFactory({ name: "main_archive", default: true }),
      packageRepositoryFactory({ url: "www.main.com" }),
      packageRepositoryFactory(),
    ];
    const state = rootStateFactory({
      packagerepository: packageRepositoryStateFactory({
        items,
      }),
    });
    expect(packagerepository.search(state, "Ubuntu")).toEqual([items[0]]);
  });
});

import packagerepository from "./packagerepository";

describe("packagerepository selectors", () => {
  it("can get repository items", () => {
    const state = {
      packagerepository: {
        items: [{ name: "default" }],
      },
    };
    expect(packagerepository.all(state)).toEqual([{ name: "default" }]);
  });

  it("can get the loading state", () => {
    const state = {
      packagerepository: {
        loading: true,
        items: [],
      },
    };
    expect(packagerepository.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = {
      packagerepository: {
        loaded: true,
        items: [],
      },
    };
    expect(packagerepository.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = {
      packagerepository: {
        saving: true,
        items: [],
      },
    };
    expect(packagerepository.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = {
      packagerepository: {
        saved: true,
        items: [],
      },
    };
    expect(packagerepository.saved(state)).toEqual(true);
  });

  it("can get packagerepository errors", () => {
    const state = {
      packagerepository: {
        errors: { name: "Name already exists" },
        items: [],
      },
    };
    expect(packagerepository.errors(state)).toStrictEqual({
      name: "Name already exists",
    });
  });

  it("can get the count", () => {
    const state = {
      packagerepository: {
        loading: true,
        items: [{ name: "foo" }, { name: "bar" }],
      },
    };
    expect(packagerepository.count(state)).toEqual(2);
  });

  it("can get a repository by id", () => {
    const state = {
      packagerepository: {
        loading: true,
        items: [
          { name: "foo", id: 101 },
          { name: "bar", id: 123 },
        ],
      },
    };
    expect(packagerepository.getById(state, 101)).toStrictEqual({
      name: "foo",
      id: 101,
    });
  });

  it("can search items", () => {
    const state = {
      packagerepository: {
        items: [
          { name: "main_archive", url: "www.website.com" },
          { name: "extra_archive", url: "www.main.com" },
          { name: "other_archive", url: "www.other.com" },
        ],
      },
    };
    expect(packagerepository.search(state, "main")).toEqual([
      { name: "main_archive", url: "www.website.com" },
      { name: "extra_archive", url: "www.main.com" },
    ]);
  });
});

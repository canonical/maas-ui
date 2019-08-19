import repositories from "./repositories";

describe("repositories selectors", () => {
  it("can get repository items", () => {
    const state = {
      packagerepository: {
        items: [{ name: "default" }]
      }
    };
    expect(repositories.all(state)).toEqual([{ name: "default" }]);
  });

  it("can get the loading state", () => {
    const state = {
      packagerepository: {
        loading: true,
        items: []
      }
    };
    expect(repositories.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = {
      packagerepository: {
        loaded: true,
        items: []
      }
    };
    expect(repositories.loaded(state)).toEqual(true);
  });

  it("can get the count", () => {
    const state = {
      packagerepository: {
        loading: true,
        items: [{ name: "foo" }, { name: "bar" }]
      }
    };
    expect(repositories.count(state)).toEqual(2);
  });

  it("can get a repository by id", () => {
    const state = {
      packagerepository: {
        loading: true,
        items: [{ name: "foo", id: 101 }, { name: "bar", id: 123 }]
      }
    };
    expect(repositories.getById(state, 101)).toStrictEqual({
      name: "foo",
      id: 101
    });
  });

  it("can search items", () => {
    const state = {
      packagerepository: {
        items: [
          { name: "main_archive", url: "www.website.com" },
          { name: "extra_archive", url: "www.main.com" },
          { name: "other_archive", url: "www.other.com" }
        ]
      }
    };
    expect(repositories.search(state, "main")).toEqual([
      { name: "main_archive", url: "www.website.com" },
      { name: "extra_archive", url: "www.main.com" }
    ]);
  });
});

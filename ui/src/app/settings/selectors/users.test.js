import users from "./users";

describe("users", () => {
  it("can get items", () => {
    const state = {
      users: {
        items: [{ name: "default" }]
      }
    };
    expect(users.get(state)).toEqual([{ name: "default" }]);
  });

  it("can get the loading state", () => {
    const state = {
      users: {
        loading: true,
        items: []
      }
    };
    expect(users.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = {
      users: {
        loaded: true,
        items: []
      }
    };
    expect(users.loaded(state)).toEqual(true);
  });

  it("can get the count", () => {
    const state = {
      users: {
        loading: true,
        items: [{ name: "foo" }, { name: "bar" }]
      }
    };
    expect(users.count(state)).toEqual(2);
  });
});

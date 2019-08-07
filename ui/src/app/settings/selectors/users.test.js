import users from "./users";

describe("users selectors", () => {
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

  it("can get a user by id", () => {
    const state = {
      users: {
        loading: true,
        items: [{ name: "foo", id: 808 }, { name: "bar", id: 909 }]
      }
    };
    expect(users.getById(state, 909)).toStrictEqual({ name: "bar", id: 909 });
  });
});

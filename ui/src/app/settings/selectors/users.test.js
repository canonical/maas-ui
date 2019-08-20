import users from "./users";

describe("users selectors", () => {
  it("can get items", () => {
    const state = {
      user: {
        items: [{ username: "default" }]
      }
    };
    expect(users.get(state)).toEqual([{ username: "default" }]);
  });

  it("can get the loading state", () => {
    const state = {
      user: {
        loading: true,
        items: []
      }
    };
    expect(users.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = {
      user: {
        loaded: true,
        items: []
      }
    };
    expect(users.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = {
      user: {
        saving: true,
        items: []
      }
    };
    expect(users.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = {
      user: {
        saved: true,
        items: []
      }
    };
    expect(users.saved(state)).toEqual(true);
  });

  it("can get the count", () => {
    const state = {
      user: {
        loading: true,
        items: [{ username: "foo" }, { username: "bar" }]
      }
    };
    expect(users.count(state)).toEqual(2);
  });

  it("can get a user by id", () => {
    const state = {
      user: {
        loading: true,
        items: [{ username: "foo", id: 808 }, { username: "bar", id: 909 }]
      }
    };
    expect(users.getById(state, 909)).toStrictEqual({
      username: "bar",
      id: 909
    });
  });

  it("can search items", () => {
    const state = {
      user: {
        items: [
          { username: "admin", email: "test@example.com" },
          { username: "me", email: "minnie@example.com" },
          { username: "richie", email: "richie@example.com" }
        ]
      }
    };
    expect(users.search(state, "min")).toEqual([
      { username: "admin", email: "test@example.com" },
      { username: "me", email: "minnie@example.com" }
    ]);
  });

  it("can get user errors", () => {
    const state = {
      user: {
        errors: { username: "Username already exists" },
        items: []
      }
    };
    expect(users.errors(state)).toStrictEqual({
      username: "Username already exists"
    });
  });
});

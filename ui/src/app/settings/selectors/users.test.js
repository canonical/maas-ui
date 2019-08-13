import users from "./users";

describe("users selectors", () => {
  it("can get items", () => {
    const state = {
      users: {
        items: [{ username: "default" }]
      }
    };
    expect(users.get(state)).toEqual([{ username: "default" }]);
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
        items: [{ username: "foo" }, { username: "bar" }]
      }
    };
    expect(users.count(state)).toEqual(2);
  });

  it("can get a user by id", () => {
    const state = {
      users: {
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
      users: {
        items: [
          { username: "admin", emai: "test@example.com" },
          { username: "me", email: "minnie@example.com" },
          { username: "richie", email: "richie@example.com" }
        ]
      }
    };
    expect(users.search(state, "min")).toEqual([
      { username: "admin", emai: "test@example.com" },
      { username: "me", email: "minnie@example.com" }
    ]);
  });
});

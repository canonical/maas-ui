import user from "./user";

describe("users selectors", () => {
  it("can get items", () => {
    const state = {
      user: {
        items: [{ username: "default" }],
      },
    };
    expect(user.get(state)).toEqual([{ username: "default" }]);
  });

  it("can get the loading state", () => {
    const state = {
      user: {
        loading: true,
        items: [],
      },
    };
    expect(user.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = {
      user: {
        loaded: true,
        items: [],
      },
    };
    expect(user.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = {
      user: {
        saving: true,
        items: [],
      },
    };
    expect(user.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = {
      user: {
        saved: true,
        items: [],
      },
    };
    expect(user.saved(state)).toEqual(true);
  });

  it("can get the count", () => {
    const state = {
      user: {
        loading: true,
        items: [{ username: "foo" }, { username: "bar" }],
      },
    };
    expect(user.count(state)).toEqual(2);
  });

  it("can get a user by id", () => {
    const state = {
      user: {
        loading: true,
        items: [
          { username: "foo", id: 808 },
          { username: "bar", id: 909 },
        ],
      },
    };
    expect(user.getById(state, 909)).toStrictEqual({
      username: "bar",
      id: 909,
    });
  });

  it("can search items", () => {
    const state = {
      user: {
        items: [
          {
            username: "admin",
            email: "test@example.com",
            last_name: "",
          },
          {
            username: "me",
            email: "minnie@example.com",
            last_name: "",
          },
          {
            username: "richie",
            email: "richie@example.com",
            last_name: "",
          },
          {
            username: "adam",
            email: "adam@example.com",
            last_name: "minichiello",
          },
        ],
      },
    };
    expect(user.search(state, "min")).toEqual([
      // Matches username:
      {
        username: "admin",
        email: "test@example.com",
        last_name: "",
      },
      // Matches email:
      {
        username: "me",
        email: "minnie@example.com",
        last_name: "",
      },
      // Matches last name:
      {
        username: "adam",
        email: "adam@example.com",
        last_name: "minichiello",
      },
    ]);
  });

  it("can get user errors", () => {
    const state = {
      user: {
        errors: { username: "Username already exists" },
        items: [],
      },
    };
    expect(user.errors(state)).toStrictEqual({
      username: "Username already exists",
    });
  });
});

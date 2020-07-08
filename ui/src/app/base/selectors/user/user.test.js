import user from "./user";
import { userState } from "testing/factories";

describe("users selectors", () => {
  it("can get items", () => {
    const state = {
      user: userState({
        items: [
          {
            username: "default",
          },
        ],
      }),
    };
    const items = user.get(state);
    expect(items.length).toEqual(1);
    expect(items[0].username).toEqual("default");
  });

  it("can get the loading state", () => {
    const state = {
      user: userState({
        loading: true,
      }),
    };
    expect(user.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = {
      user: userState({
        loaded: true,
      }),
    };
    expect(user.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = {
      user: userState({
        saving: true,
      }),
    };
    expect(user.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = {
      user: userState({
        saved: true,
      }),
    };
    expect(user.saved(state)).toEqual(true);
  });

  it("can get the count", () => {
    const state = {
      user: userState({
        items: [{ username: "foo" }, { username: "bar" }],
      }),
    };
    expect(user.count(state)).toEqual(2);
  });

  it("can get a user by id", () => {
    const state = {
      user: userState({
        items: [
          { username: "foo", id: 808 },
          { username: "bar", id: 909 },
        ],
      }),
    };
    expect(user.getById(state, 909)).toStrictEqual({
      username: "bar",
      id: 909,
    });
  });

  it("can search items", () => {
    const state = {
      user: userState({
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
      }),
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
      user: userState({
        errors: { username: "Username already exists" },
      }),
    };
    expect(user.errors(state)).toStrictEqual({
      username: "Username already exists",
    });
  });
});

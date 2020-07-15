import user from "./selectors";
import {
  user as userFactory,
  userState as userStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("users selectors", () => {
  it("can get items", () => {
    const state = rootStateFactory({
      user: userStateFactory({
        items: [
          userFactory({
            username: "default",
          }),
        ],
      }),
    });
    const items = user.get(state);
    expect(items.length).toEqual(1);
    expect(items[0].username).toEqual("default");
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      user: userStateFactory({
        loading: true,
      }),
    });
    expect(user.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      user: userStateFactory({
        loaded: true,
      }),
    });
    expect(user.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = rootStateFactory({
      user: userStateFactory({
        saving: true,
      }),
    });
    expect(user.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = rootStateFactory({
      user: userStateFactory({
        saved: true,
      }),
    });
    expect(user.saved(state)).toEqual(true);
  });

  it("can get the count", () => {
    const state = rootStateFactory({
      user: userStateFactory({
        items: [
          userFactory({ username: "foo" }),
          userFactory({ username: "bar" }),
        ],
      }),
    });
    expect(user.count(state)).toEqual(2);
  });

  it("can get a user by id", () => {
    const items = [userFactory({ id: 808 }), userFactory({ id: 909 })];
    const state = rootStateFactory({
      user: userStateFactory({
        items,
      }),
    });
    expect(user.getById(state, 909)).toEqual(items[1]);
  });

  it("can search items", () => {
    const state = rootStateFactory({
      user: userStateFactory({
        items: [
          userFactory({
            username: "admin",
            email: "test@example.com",
            last_name: "",
          }),
          userFactory({
            username: "me",
            email: "minnie@example.com",
            last_name: "",
          }),
          userFactory({
            username: "richie",
            email: "richie@example.com",
            last_name: "",
          }),
          userFactory({
            username: "adam",
            email: "adam@example.com",
            last_name: "minichiello",
          }),
        ],
      }),
    });
    const results = user.search(state, "min");
    expect(results.length).toEqual(3);
    // Matches username:
    expect(results[0].username).toEqual("admin");
    // Matches email:
    expect(results[1].email).toEqual("minnie@example.com");
    // Matches last name:
    expect(results[2].last_name).toEqual("minichiello");
  });

  it("can get user errors", () => {
    const state = rootStateFactory({
      user: userStateFactory({
        errors: { username: "Username already exists" },
      }),
    });
    expect(user.errors(state)).toStrictEqual({
      username: "Username already exists",
    });
  });
});

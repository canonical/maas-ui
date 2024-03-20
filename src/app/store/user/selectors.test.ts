import user from "./selectors";

import * as factory from "@/testing/factories";

describe("users selectors", () => {
  it("can get items", () => {
    const state = factory.rootState({
      user: factory.userState({
        items: [
          factory.user({
            username: "default",
          }),
        ],
      }),
    });
    const items = user.all(state);
    expect(items.length).toEqual(1);
    expect(items[0].username).toEqual("default");
  });

  it("can get the loading state", () => {
    const state = factory.rootState({
      user: factory.userState({
        loading: true,
      }),
    });
    expect(user.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = factory.rootState({
      user: factory.userState({
        loaded: true,
      }),
    });
    expect(user.loaded(state)).toEqual(true);
  });

  it("can get the saving state", () => {
    const state = factory.rootState({
      user: factory.userState({
        saving: true,
      }),
    });
    expect(user.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = factory.rootState({
      user: factory.userState({
        saved: true,
      }),
    });
    expect(user.saved(state)).toEqual(true);
  });

  it("can get the count", () => {
    const state = factory.rootState({
      user: factory.userState({
        items: [
          factory.user({ username: "foo" }),
          factory.user({ username: "bar" }),
        ],
      }),
    });
    expect(user.count(state)).toEqual(2);
  });

  it("can get a user by id", () => {
    const items = [factory.user({ id: 808 }), factory.user({ id: 909 })];
    const state = factory.rootState({
      user: factory.userState({
        items,
      }),
    });
    expect(user.getById(state, 909)).toEqual(items[1]);
  });

  it("can get a user by username", () => {
    const items = [
      factory.user({ username: "maas-user", id: 808 }),
      factory.user({ username: "maas-user-1", id: 909 }),
    ];
    const state = factory.rootState({
      user: factory.userState({
        items,
      }),
    });
    expect(user.getByUsername(state, "maas-user-1")).toEqual(items[1]);
  });

  it("can search items", () => {
    const state = factory.rootState({
      user: factory.userState({
        items: [
          factory.user({
            username: "admin",
            email: "test@example.com",
            last_name: "",
          }),
          factory.user({
            username: "me",
            email: "minnie@example.com",
            last_name: "",
          }),
          factory.user({
            username: "richie",
            email: "richie@example.com",
            last_name: "",
          }),
          factory.user({
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
    const state = factory.rootState({
      user: factory.userState({
        errors: { username: "Username already exists" },
      }),
    });
    expect(user.errors(state)).toStrictEqual({
      username: "Username already exists",
    });
  });

  it("can get the markingIntroComplete status", () => {
    const state = factory.rootState({
      user: factory.userState({
        statuses: factory.userStatuses({
          markingIntroComplete: true,
        }),
      }),
    });
    expect(user.markingIntroComplete(state)).toBe(true);
  });

  it("can get markingIntroComplete errors", () => {
    const state = factory.rootState({
      user: factory.userState({
        eventErrors: [factory.userEventError({ error: "Uh oh" })],
      }),
    });
    expect(user.markingIntroCompleteErrors(state)).toBe("Uh oh");
  });
});

import users from "./users";

describe("users", () => {
  it("can get user items", () => {
    const state = {
      users: {
        items: [{ name: "default" }]
      }
    };
    expect(users.get(state)).toEqual([{ name: "default" }]);
  });
});

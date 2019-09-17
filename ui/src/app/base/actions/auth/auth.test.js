import auth from "./auth";

describe("base actions", () => {
  it("should handle fetching the current user", () => {
    expect(auth.fetch()).toEqual({
      type: "FETCH_AUTH_USER",
      meta: {
        model: "user",
        method: "auth_user"
      }
    });
  });
});

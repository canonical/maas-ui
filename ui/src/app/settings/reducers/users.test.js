import users from "./users";

describe("status", () => {
  it("should return the initial state", () => {
    expect(users(undefined, {})).toEqual({
      loading: false,
      items: []
    });
  });

  it("should correctly reduce FETCH_USERS_START", () => {
    expect(
      users(undefined, {
        type: "FETCH_USERS_START"
      })
    ).toEqual({
      loading: true,
      items: []
    });
  });

  it("should correctly reduce FETCH_USERS_SUCCESS", () => {
    expect(
      users(
        {
          loading: true,
          items: []
        },
        {
          type: "FETCH_USERS_SUCCESS",
          payload: [{ id: 1, username: "admin" }, { id: 2, username: "user1" }]
        }
      )
    ).toEqual({
      loading: false,
      items: [{ id: 1, username: "admin" }, { id: 2, username: "user1" }]
    });
  });
});

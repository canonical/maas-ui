import createRootReducer from "./root-reducer";

describe("rootReducer", () => {
  it(`should reset app to initial state on LOGOUT_SUCCESS, except status which
    resets to authenticating = false`, () => {
    const initialState = {
      status: { authenticating: true },
    };
    const newState = createRootReducer({})(initialState, {
      type: "LOGOUT_SUCCESS",
    });

    expect(newState.status.authenticating).toBe(false);
    expect(newState).toMatchSnapshot();
  });

  it("it should clear the state when disconnected from the websocket", () => {
    const initialState = {
      machine: {
        items: [1, 2, 3],
      },
      status: { authenticating: true },
      user: {
        items: [1, 2, 3],
        auth: {
          user: { id: 1 },
        },
      },
    };
    const newState = createRootReducer({})(initialState, {
      type: "WEBSOCKET_DISCONNECTED",
    });

    expect(newState.machine.items.length).toBe(0);
    expect(newState.status.authenticating).toBe(true);
    expect(newState.user.items.length).toBe(0);
    expect(newState.user.auth.user).toStrictEqual({ id: 1 });
  });
});

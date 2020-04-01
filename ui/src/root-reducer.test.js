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
});

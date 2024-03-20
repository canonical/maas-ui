import createRootReducer from "./root-reducer";

import * as factory from "@/testing/factories";

describe("rootReducer", () => {
  it(`should reset app to initial state on LOGOUT_SUCCESS, except status which
    resets to authenticating = false`, () => {
    const initialState = factory.rootState({
      status: factory.statusState({ authenticating: true }),
    });
    const newState = createRootReducer(
      vi.fn().mockReturnValue(factory.routerState())
    )(initialState, {
      type: "status/logoutSuccess",
    });

    expect(newState.status.authenticating).toBe(false);
    expect(newState).toMatchSnapshot();
  });

  it("it should clear the state on status/checkAuthenticatedError", () => {
    const authUser = factory.user();
    const initialState = factory.rootState({
      machine: factory.machineState({
        items: [factory.machine(), factory.machine(), factory.machine()],
      }),
      status: factory.statusState({ authenticating: true }),
      user: factory.userState({
        auth: factory.authState({
          user: authUser,
        }),
        items: [factory.user(), factory.user(), factory.user()],
      }),
    });
    const newState = createRootReducer(
      vi.fn().mockReturnValue(factory.routerState())
    )(initialState, {
      type: "status/checkAuthenticatedError",
    });

    expect(newState.machine.items.length).toBe(0);
    expect(newState.status.authenticating).toBe(false);
    expect(newState.user.items.length).toBe(0);
    expect(newState.user.auth.user).toStrictEqual(authUser);
  });
});

import createRootReducer from "./root-reducer";

import {
  authState as authStateFactory,
  machineState as machineStateFactory,
  machine as machineFactory,
  rootState as rootStateFactory,
  routerState as routerStateFactory,
  statusState as statusStateFactory,
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";

describe("rootReducer", () => {
  it(`should reset app to initial state on LOGOUT_SUCCESS, except status which
    resets to authenticating = false`, () => {
    const initialState = rootStateFactory({
      status: statusStateFactory({ authenticating: true }),
    });
    const newState = createRootReducer(
      jest.fn().mockReturnValue(routerStateFactory())
    )(initialState, {
      type: "status/logoutSuccess",
    });

    expect(newState.status.authenticating).toBe(false);
    expect(newState).toMatchSnapshot();
  });

  it("it should clear the state when disconnected from the websocket", () => {
    const authUser = userFactory();
    const initialState = rootStateFactory({
      machine: machineStateFactory({
        items: [machineFactory(), machineFactory(), machineFactory()],
      }),
      status: statusStateFactory({ authenticating: true }),
      user: userStateFactory({
        auth: authStateFactory({
          user: authUser,
        }),
        items: [userFactory(), userFactory(), userFactory()],
      }),
    });
    const newState = createRootReducer(
      jest.fn().mockReturnValue(routerStateFactory())
    )(initialState, {
      type: "status/websocketDisconnected",
    });

    expect(newState.machine.items.length).toBe(0);
    expect(newState.status.authenticating).toBe(true);
    expect(newState.user.items.length).toBe(0);
    expect(newState.user.auth.user).toStrictEqual(authUser);
  });
});

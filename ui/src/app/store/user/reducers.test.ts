import reducers, { actions } from "./slice";

import {
  user as userFactory,
  userState as userStateFactory,
} from "testing/factories";

describe("users reducer", () => {
  let state;
  beforeEach(() => {
    // Reset the state to not contain any data.
    state = { auth: {}, items: [] };
  });

  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual({
      ...userStateFactory(state),
      errors: null,
    });
  });

  describe("fetch", () => {
    it("reduces fetchStart", () => {
      const initialState = userStateFactory({ ...state, loading: false });
      expect(reducers(initialState, actions.fetchStart())).toEqual(
        userStateFactory({ ...state, loading: true })
      );
    });

    it("reduces fetchSuccess", () => {
      const initialState = userStateFactory({
        ...state,
        items: [],
        loaded: false,
        loading: true,
      });
      const users = [userFactory(), userFactory()];

      expect(reducers(initialState, actions.fetchSuccess(users))).toEqual(
        userStateFactory({
          ...state,
          items: users,
          loaded: true,
          loading: false,
        })
      );
    });

    it("reduces fetchError", () => {
      const initialState = userStateFactory({
        ...state,
        errors: "",
        loading: true,
      });
      expect(
        reducers(initialState, actions.fetchError("Could not fetch users"))
      ).toEqual(
        userStateFactory({
          ...state,
          errors: "Could not fetch users",
          loading: false,
        })
      );
    });
  });

  describe("create", () => {
    it("reduces createStart", () => {
      const initialState = userStateFactory({ ...state, saving: false });
      expect(reducers(initialState, actions.createStart())).toEqual(
        userStateFactory({ ...state, saving: true })
      );
    });

    it("reduces createSuccess", () => {
      const initialState = userStateFactory({
        ...state,
        saved: false,
        saving: true,
      });
      expect(reducers(initialState, actions.createSuccess())).toEqual(
        userStateFactory({ ...state, saved: true, saving: false })
      );
    });

    it("reduces createNotify", () => {
      const initialState = userStateFactory({
        ...state,
        items: [userFactory()],
      });
      const newUser = userFactory();
      expect(reducers(initialState, actions.createNotify(newUser))).toEqual(
        userStateFactory({ ...state, items: [...initialState.items, newUser] })
      );
    });

    it("reduces createError", () => {
      const initialState = userStateFactory({
        ...state,
        errors: "",
        saving: true,
      });
      expect(
        reducers(initialState, actions.createError("Could not create user"))
      ).toEqual(
        userStateFactory({
          ...state,
          errors: "Could not create user",
          saving: false,
        })
      );
    });
  });

  describe("update", () => {
    it("reduces updateStart", () => {
      const initialState = userStateFactory({ ...state, saving: false });
      expect(reducers(initialState, actions.updateStart())).toEqual(
        userStateFactory({ ...state, saving: true })
      );
    });

    it("reduces updateSuccess", () => {
      const initialState = userStateFactory({
        ...state,
        saved: false,
        saving: true,
      });
      expect(reducers(initialState, actions.updateSuccess())).toEqual(
        userStateFactory({ ...state, saved: true, saving: false })
      );
    });

    it("reduces updateNotify", () => {
      const initialState = userStateFactory({
        ...state,
        items: [userFactory()],
      });
      const updatedUser = userFactory({
        id: initialState.items[0].id,
        name: "updated-reducers",
      });
      expect(reducers(initialState, actions.updateNotify(updatedUser))).toEqual(
        userStateFactory({ ...state, items: [updatedUser] })
      );
    });

    it("reduces updateError", () => {
      const initialState = userStateFactory({
        ...state,
        errors: "",
        saving: true,
      });
      expect(
        reducers(initialState, actions.updateError("Could not update user"))
      ).toEqual(
        userStateFactory({
          ...state,
          errors: "Could not update user",
          saving: false,
        })
      );
    });
  });

  describe("delete", () => {
    it("reduces deleteStart", () => {
      const initialState = userStateFactory({ ...state, saving: false });
      expect(reducers(initialState, actions.deleteStart())).toEqual(
        userStateFactory({ ...state, saving: true })
      );
    });

    it("reduces deleteSuccess", () => {
      const initialState = userStateFactory({
        ...state,
        saved: false,
        saving: true,
      });
      expect(reducers(initialState, actions.deleteSuccess())).toEqual(
        userStateFactory({ ...state, saved: true, saving: false })
      );
    });

    it("reduces deleteNotify", () => {
      const [deleteUser, keepUser] = [userFactory(), userFactory()];
      const initialState = userStateFactory({
        ...state,
        items: [deleteUser, keepUser],
      });
      expect(
        reducers(initialState, actions.deleteNotify(deleteUser.id))
      ).toEqual(userStateFactory({ ...state, items: [keepUser] }));
    });

    it("reduces deleteError", () => {
      const initialState = userStateFactory({
        ...state,
        errors: "",
        saving: true,
      });
      expect(
        reducers(initialState, actions.deleteError("Could not delete user"))
      ).toEqual(
        userStateFactory({
          ...state,
          errors: "Could not delete user",
          saving: false,
        })
      );
    });
  });
});

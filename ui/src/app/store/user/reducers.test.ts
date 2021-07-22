import reducers, { actions } from "./slice";

import {
  user as userFactory,
  userEventError as userEventErrorFactory,
  authState as authStateFactory,
  userState as userStateFactory,
  userStatuses as userStatusesFactory,
} from "testing/factories";

describe("users reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual(userStateFactory());
  });

  describe("fetch", () => {
    it("reduces fetchStart", () => {
      const initialState = userStateFactory({ loading: false });
      expect(reducers(initialState, actions.fetchStart())).toEqual(
        userStateFactory({ loading: true })
      );
    });

    it("reduces fetchSuccess", () => {
      const initialState = userStateFactory({
        items: [],
        loaded: false,
        loading: true,
      });
      const users = [userFactory(), userFactory()];

      expect(reducers(initialState, actions.fetchSuccess(users))).toEqual(
        userStateFactory({
          items: users,
          loaded: true,
          loading: false,
        })
      );
    });

    it("reduces fetchError", () => {
      const initialState = userStateFactory({
        errors: "",
        loading: true,
      });
      expect(
        reducers(initialState, actions.fetchError("Could not fetch users"))
      ).toEqual(
        userStateFactory({
          errors: "Could not fetch users",
          loading: false,
        })
      );
    });
  });

  describe("create", () => {
    it("reduces createStart", () => {
      const initialState = userStateFactory({ saving: false });
      expect(reducers(initialState, actions.createStart())).toEqual(
        userStateFactory({ saving: true })
      );
    });

    it("reduces createSuccess", () => {
      const initialState = userStateFactory({
        saved: false,
        saving: true,
      });
      expect(reducers(initialState, actions.createSuccess())).toEqual(
        userStateFactory({ saved: true, saving: false })
      );
    });

    it("reduces createNotify", () => {
      const initialState = userStateFactory({
        items: [userFactory()],
      });
      const newUser = userFactory();
      expect(reducers(initialState, actions.createNotify(newUser))).toEqual(
        userStateFactory({ items: [...initialState.items, newUser] })
      );
    });

    it("reduces createError", () => {
      const initialState = userStateFactory({
        errors: "",
        saving: true,
      });
      expect(
        reducers(initialState, actions.createError("Could not create user"))
      ).toEqual(
        userStateFactory({
          errors: "Could not create user",
          saving: false,
        })
      );
    });
  });

  describe("update", () => {
    it("reduces updateStart", () => {
      const initialState = userStateFactory({ saving: false });
      expect(reducers(initialState, actions.updateStart())).toEqual(
        userStateFactory({ saving: true })
      );
    });

    it("reduces updateSuccess", () => {
      const initialState = userStateFactory({
        saved: false,
        saving: true,
      });
      expect(reducers(initialState, actions.updateSuccess())).toEqual(
        userStateFactory({ saved: true, saving: false })
      );
    });

    it("reduces updateNotify", () => {
      const items = [userFactory()];
      const initialState = userStateFactory({
        items,
      });
      const updatedUser = {
        ...items[0],
        username: "updated-reducers",
      };
      expect(reducers(initialState, actions.updateNotify(updatedUser))).toEqual(
        userStateFactory({ items: [updatedUser] })
      );
    });

    it("reduces updateError", () => {
      const initialState = userStateFactory({
        errors: "",
        saving: true,
      });
      expect(
        reducers(initialState, actions.updateError("Could not update user"))
      ).toEqual(
        userStateFactory({
          errors: "Could not update user",
          saving: false,
        })
      );
    });
  });

  describe("delete", () => {
    it("reduces deleteStart", () => {
      const initialState = userStateFactory({ saving: false });
      expect(reducers(initialState, actions.deleteStart())).toEqual(
        userStateFactory({ saving: true })
      );
    });

    it("reduces deleteSuccess", () => {
      const initialState = userStateFactory({
        saved: false,
        saving: true,
      });
      expect(reducers(initialState, actions.deleteSuccess())).toEqual(
        userStateFactory({ saved: true, saving: false })
      );
    });

    it("reduces deleteNotify", () => {
      const [deleteUser, keepUser] = [userFactory(), userFactory()];
      const initialState = userStateFactory({
        items: [deleteUser, keepUser],
      });
      expect(
        reducers(initialState, actions.deleteNotify(deleteUser.id))
      ).toEqual(userStateFactory({ items: [keepUser] }));
    });

    it("reduces deleteError", () => {
      const initialState = userStateFactory({
        errors: "",
        saving: true,
      });
      expect(
        reducers(initialState, actions.deleteError("Could not delete user"))
      ).toEqual(
        userStateFactory({
          errors: "Could not delete user",
          saving: false,
        })
      );
    });
  });

  describe("markIntroComplete", () => {
    it("reduces markIntroCompleteStart", () => {
      expect(
        reducers(
          userStateFactory({
            statuses: userStatusesFactory({
              markingIntroComplete: false,
            }),
          }),
          actions.markIntroCompleteStart()
        )
      ).toEqual(
        userStateFactory({
          statuses: userStatusesFactory({
            markingIntroComplete: true,
          }),
        })
      );
    });

    it("reduces markIntroCompleteSuccess", () => {
      const authUser = userFactory({ completed_intro: false });
      expect(
        reducers(
          userStateFactory({
            auth: authStateFactory({
              user: authUser,
            }),
            statuses: userStatusesFactory({
              markingIntroComplete: true,
            }),
          }),
          actions.markIntroCompleteSuccess(
            userFactory({ completed_intro: true })
          )
        )
      ).toEqual(
        userStateFactory({
          auth: authStateFactory({
            user: {
              ...authUser,
              completed_intro: true,
            },
          }),
          statuses: userStatusesFactory({
            markingIntroComplete: false,
          }),
        })
      );
    });

    it("reduces markIntroCompleteError", () => {
      expect(
        reducers(
          userStateFactory({
            statuses: userStatusesFactory({
              markingIntroComplete: true,
            }),
          }),
          actions.markIntroCompleteError("Uh oh!")
        )
      ).toEqual(
        userStateFactory({
          eventErrors: [
            userEventErrorFactory({
              error: "Uh oh!",
              event: "markIntroComplete",
            }),
          ],
          statuses: userStatusesFactory({
            markingIntroComplete: false,
          }),
        })
      );
    });
  });
});

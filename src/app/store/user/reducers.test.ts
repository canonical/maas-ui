import reducers, { actions } from "./slice";

import * as factory from "@/testing/factories";

describe("users reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual(factory.userState());
  });

  describe("fetch", () => {
    it("reduces fetchStart", () => {
      const initialState = factory.userState({ loading: false });
      expect(reducers(initialState, actions.fetchStart())).toEqual(
        factory.userState({ loading: true })
      );
    });

    it("reduces fetchSuccess", () => {
      const initialState = factory.userState({
        items: [],
        loaded: false,
        loading: true,
      });
      const users = [factory.user(), factory.user()];

      expect(reducers(initialState, actions.fetchSuccess(users))).toEqual(
        factory.userState({
          items: users,
          loaded: true,
          loading: false,
        })
      );
    });

    it("reduces fetchError", () => {
      const initialState = factory.userState({
        errors: "",
        loading: true,
      });
      expect(
        reducers(initialState, actions.fetchError("Could not fetch users"))
      ).toEqual(
        factory.userState({
          errors: "Could not fetch users",
          loading: false,
        })
      );
    });
  });

  describe("create", () => {
    it("reduces createStart", () => {
      const initialState = factory.userState({ saving: false });
      expect(reducers(initialState, actions.createStart())).toEqual(
        factory.userState({ saving: true })
      );
    });

    it("reduces createSuccess", () => {
      const initialState = factory.userState({
        saved: false,
        saving: true,
      });
      expect(reducers(initialState, actions.createSuccess())).toEqual(
        factory.userState({ saved: true, saving: false })
      );
    });

    it("reduces createNotify", () => {
      const initialState = factory.userState({
        items: [factory.user()],
      });
      const newUser = factory.user();
      expect(reducers(initialState, actions.createNotify(newUser))).toEqual(
        factory.userState({ items: [...initialState.items, newUser] })
      );
    });

    it("reduces createError", () => {
      const initialState = factory.userState({
        errors: "",
        saving: true,
      });
      expect(
        reducers(initialState, actions.createError("Could not create user"))
      ).toEqual(
        factory.userState({
          errors: "Could not create user",
          saving: false,
        })
      );
    });
  });

  describe("update", () => {
    it("reduces updateStart", () => {
      const initialState = factory.userState({ saving: false });
      expect(reducers(initialState, actions.updateStart())).toEqual(
        factory.userState({ saving: true })
      );
    });

    it("reduces updateSuccess", () => {
      const initialState = factory.userState({
        saved: false,
        saving: true,
      });
      expect(reducers(initialState, actions.updateSuccess())).toEqual(
        factory.userState({ saved: true, saving: false })
      );
    });

    it("reduces updateNotify", () => {
      const items = [factory.user()];
      const initialState = factory.userState({
        items,
      });
      const updatedUser = {
        ...items[0],
        username: "updated-reducers",
      };
      expect(reducers(initialState, actions.updateNotify(updatedUser))).toEqual(
        factory.userState({ items: [updatedUser] })
      );
    });

    it("reduces updateError", () => {
      const initialState = factory.userState({
        errors: "",
        saving: true,
      });
      expect(
        reducers(initialState, actions.updateError("Could not update user"))
      ).toEqual(
        factory.userState({
          errors: "Could not update user",
          saving: false,
        })
      );
    });
  });

  describe("delete", () => {
    it("reduces deleteStart", () => {
      const initialState = factory.userState({ saving: false });
      expect(reducers(initialState, actions.deleteStart())).toEqual(
        factory.userState({ saving: true })
      );
    });

    it("reduces deleteSuccess", () => {
      const initialState = factory.userState({
        saved: false,
        saving: true,
      });
      expect(reducers(initialState, actions.deleteSuccess())).toEqual(
        factory.userState({ saved: true, saving: false })
      );
    });

    it("reduces deleteNotify", () => {
      const [deleteUser, keepUser] = [factory.user(), factory.user()];
      const initialState = factory.userState({
        items: [deleteUser, keepUser],
      });
      expect(
        reducers(initialState, actions.deleteNotify(deleteUser.id))
      ).toEqual(factory.userState({ items: [keepUser] }));
    });

    it("reduces deleteError", () => {
      const initialState = factory.userState({
        errors: "",
        saving: true,
      });
      expect(
        reducers(initialState, actions.deleteError("Could not delete user"))
      ).toEqual(
        factory.userState({
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
          factory.userState({
            statuses: factory.userStatuses({
              markingIntroComplete: false,
            }),
          }),
          actions.markIntroCompleteStart()
        )
      ).toEqual(
        factory.userState({
          statuses: factory.userStatuses({
            markingIntroComplete: true,
          }),
        })
      );
    });

    it("reduces markIntroCompleteSuccess", () => {
      const authUser = factory.user({ completed_intro: false });
      expect(
        reducers(
          factory.userState({
            auth: factory.authState({
              user: authUser,
            }),
            statuses: factory.userStatuses({
              markingIntroComplete: true,
            }),
          }),
          actions.markIntroCompleteSuccess(
            factory.user({ completed_intro: true })
          )
        )
      ).toEqual(
        factory.userState({
          auth: factory.authState({
            user: {
              ...authUser,
              completed_intro: true,
            },
          }),
          statuses: factory.userStatuses({
            markingIntroComplete: false,
          }),
        })
      );
    });

    it("reduces markIntroCompleteError", () => {
      expect(
        reducers(
          factory.userState({
            statuses: factory.userStatuses({
              markingIntroComplete: true,
            }),
          }),
          actions.markIntroCompleteError("Uh oh!")
        )
      ).toEqual(
        factory.userState({
          eventErrors: [
            factory.userEventError({
              error: "Uh oh!",
              event: "markIntroComplete",
            }),
          ],
          statuses: factory.userStatuses({
            markingIntroComplete: false,
          }),
        })
      );
    });
  });
});

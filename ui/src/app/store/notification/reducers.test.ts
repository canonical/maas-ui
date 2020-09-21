import reducers, { actions } from "./slice";

import type { NotificationState } from "./types";

import {
  notification as notificationFactory,
  notificationState as notificationStateFactory,
} from "testing/factories";

describe("notifications reducer", () => {
  let state: Pick<NotificationState, "items">;
  beforeEach(() => {
    // Reset the state to not contain any data.
    state = { items: [] };
  });

  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual({
      ...notificationStateFactory(state),
      errors: null,
    });
  });

  describe("fetch", () => {
    it("reduces fetchStart", () => {
      const initialState = notificationStateFactory({
        ...state,
        loading: false,
      });
      expect(reducers(initialState, actions.fetchStart())).toEqual(
        notificationStateFactory({ ...state, loading: true })
      );
    });

    it("reduces fetchSuccess", () => {
      const initialState = notificationStateFactory({
        ...state,
        items: [],
        loaded: false,
        loading: true,
      });
      const notifications = [notificationFactory(), notificationFactory()];

      expect(
        reducers(initialState, actions.fetchSuccess(notifications))
      ).toEqual(
        notificationStateFactory({
          ...state,
          items: notifications,
          loaded: true,
          loading: false,
        })
      );
    });

    it("reduces fetchError", () => {
      const initialState = notificationStateFactory({
        ...state,
        errors: "",
        loading: true,
      });
      expect(
        reducers(
          initialState,
          actions.fetchError("Could not fetch notifications")
        )
      ).toEqual(
        notificationStateFactory({
          ...state,
          errors: "Could not fetch notifications",
          loading: false,
        })
      );
    });
  });

  describe("create", () => {
    it("reduces createStart", () => {
      const initialState = notificationStateFactory({
        ...state,
        saving: false,
      });
      expect(reducers(initialState, actions.createStart())).toEqual(
        notificationStateFactory({ ...state, saving: true })
      );
    });

    it("reduces createSuccess", () => {
      const initialState = notificationStateFactory({
        ...state,
        saved: false,
        saving: true,
      });
      expect(reducers(initialState, actions.createSuccess())).toEqual(
        notificationStateFactory({ ...state, saved: true, saving: false })
      );
    });

    it("reduces createNotify", () => {
      const initialState = notificationStateFactory({
        ...state,
        items: [notificationFactory()],
      });
      const newNotification = notificationFactory();
      expect(
        reducers(initialState, actions.createNotify(newNotification))
      ).toEqual(
        notificationStateFactory({
          ...state,
          items: [...initialState.items, newNotification],
        })
      );
    });

    it("reduces createError", () => {
      const initialState = notificationStateFactory({
        ...state,
        errors: "",
        saving: true,
      });
      expect(
        reducers(
          initialState,
          actions.createError("Could not create notification")
        )
      ).toEqual(
        notificationStateFactory({
          ...state,
          errors: "Could not create notification",
          saving: false,
        })
      );
    });
  });

  describe("update", () => {
    it("reduces updateStart", () => {
      const initialState = notificationStateFactory({
        ...state,
        saving: false,
      });
      expect(reducers(initialState, actions.updateStart())).toEqual(
        notificationStateFactory({ ...state, saving: true })
      );
    });

    it("reduces updateSuccess", () => {
      const initialState = notificationStateFactory({
        ...state,
        saved: false,
        saving: true,
      });
      expect(reducers(initialState, actions.updateSuccess())).toEqual(
        notificationStateFactory({ ...state, saved: true, saving: false })
      );
    });

    it("reduces updateNotify", () => {
      const initialState = notificationStateFactory({
        ...state,
        items: [notificationFactory()],
      });
      const updatedNotification = notificationFactory({
        id: initialState.items[0].id,
        message: "updated-reducers",
      });
      expect(
        reducers(initialState, actions.updateNotify(updatedNotification))
      ).toEqual(
        notificationStateFactory({ ...state, items: [updatedNotification] })
      );
    });

    it("reduces updateError", () => {
      const initialState = notificationStateFactory({
        ...state,
        errors: "",
        saving: true,
      });
      expect(
        reducers(
          initialState,
          actions.updateError("Could not update notification")
        )
      ).toEqual(
        notificationStateFactory({
          ...state,
          errors: "Could not update notification",
          saving: false,
        })
      );
    });
  });

  describe("dismiss", () => {
    it("reduces dismissStart", () => {
      const initialState = notificationStateFactory({
        ...state,
        saving: false,
      });
      expect(reducers(initialState, actions.dismissStart())).toEqual(
        notificationStateFactory({ ...state, saving: true })
      );
    });

    it("reduces dismissSuccess", () => {
      const initialState = notificationStateFactory({
        ...state,
        saved: false,
        saving: true,
      });
      expect(reducers(initialState, actions.dismissSuccess())).toEqual(
        notificationStateFactory({ ...state, saved: true, saving: false })
      );
    });

    it("reduces deleteNotify", () => {
      const [deleteNotification, keepNotification] = [
        notificationFactory(),
        notificationFactory(),
      ];
      const initialState = notificationStateFactory({
        ...state,
        items: [deleteNotification, keepNotification],
      });
      expect(
        reducers(initialState, actions.deleteNotify(deleteNotification.id))
      ).toEqual(
        notificationStateFactory({ ...state, items: [keepNotification] })
      );
    });

    it("reduces dismissError", () => {
      const initialState = notificationStateFactory({
        ...state,
        errors: "",
        saving: true,
      });
      expect(
        reducers(
          initialState,
          actions.dismissError("Could not dismiss notification")
        )
      ).toEqual(
        notificationStateFactory({
          ...state,
          errors: "Could not dismiss notification",
          saving: false,
        })
      );
    });
  });
});

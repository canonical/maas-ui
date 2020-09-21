import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
} from "testing/factories";
import reducers, { actions } from "./slice";

describe("controller reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual(controllerStateFactory());
  });

  describe("fetch", () => {
    it("reduces fetchStart", () => {
      const initialState = controllerStateFactory({ loading: false });

      expect(reducers(initialState, actions.fetchStart())).toEqual(
        controllerStateFactory({ loading: true })
      );
    });

    it("reduces fetchSuccess", () => {
      const initialState = controllerStateFactory({
        items: [],
        loaded: false,
        loading: true,
      });
      const controllers = [controllerFactory(), controllerFactory()];

      expect(reducers(initialState, actions.fetchSuccess(controllers))).toEqual(
        controllerStateFactory({
          items: controllers,
          loaded: true,
          loading: false,
        })
      );
    });

    it("reduces fetchError", () => {
      const initialState = controllerStateFactory({
        errors: null,
        loading: true,
      });

      expect(
        reducers(
          initialState,
          actions.fetchError("Could not fetch controllers")
        )
      ).toEqual(
        controllerStateFactory({
          errors: "Could not fetch controllers",
          loading: false,
        })
      );
    });
  });

  describe("create", () => {
    it("reduces createStart", () => {
      const initialState = controllerStateFactory({ saving: false });

      expect(reducers(initialState, actions.createStart())).toEqual(
        controllerStateFactory({ saving: true })
      );
    });

    it("reduces createSuccess", () => {
      const initialState = controllerStateFactory({
        saved: false,
        saving: true,
      });

      expect(reducers(initialState, actions.createSuccess())).toEqual(
        controllerStateFactory({ saved: true, saving: false })
      );
    });

    it("reduces createNotify", () => {
      const initialState = controllerStateFactory({
        items: [controllerFactory()],
      });
      const newController = controllerFactory();

      expect(
        reducers(initialState, actions.createNotify(newController))
      ).toEqual(
        controllerStateFactory({
          items: [...initialState.items, newController],
        })
      );
    });

    it("reduces createError", () => {
      const initialState = controllerStateFactory({
        errors: null,
        saving: true,
      });

      expect(
        reducers(
          initialState,
          actions.createError("Could not create controller")
        )
      ).toEqual(
        controllerStateFactory({
          errors: "Could not create controller",
          saving: false,
        })
      );
    });
  });

  describe("update", () => {
    it("reduces updateStart", () => {
      const initialState = controllerStateFactory({ saving: false });

      expect(reducers(initialState, actions.updateStart())).toEqual(
        controllerStateFactory({ saving: true })
      );
    });

    it("reduces updateSuccess", () => {
      const initialState = controllerStateFactory({
        saved: false,
        saving: true,
      });

      expect(reducers(initialState, actions.updateSuccess())).toEqual(
        controllerStateFactory({ saved: true, saving: false })
      );
    });

    it("reduces updateNotify", () => {
      const initialState = controllerStateFactory({
        items: [controllerFactory()],
      });
      const updatedController = controllerFactory({
        id: initialState.items[0].id,
        hostname: "updated-reducers",
      });

      expect(
        reducers(initialState, actions.updateNotify(updatedController))
      ).toEqual(controllerStateFactory({ items: [updatedController] }));
    });

    it("reduces updateError", () => {
      const initialState = controllerStateFactory({
        errors: null,
        saving: true,
      });

      expect(
        reducers(
          initialState,
          actions.updateError("Could not update controller")
        )
      ).toEqual(
        controllerStateFactory({
          errors: "Could not update controller",
          saving: false,
        })
      );
    });
  });

  describe("delete", () => {
    it("reduces deleteStart", () => {
      const initialState = controllerStateFactory({ saving: false });

      expect(reducers(initialState, actions.deleteStart())).toEqual(
        controllerStateFactory({ saving: true })
      );
    });

    it("reduces deleteSuccess", () => {
      const initialState = controllerStateFactory({
        saved: false,
        saving: true,
      });

      expect(reducers(initialState, actions.deleteSuccess())).toEqual(
        controllerStateFactory({ saved: true, saving: false })
      );
    });

    it("reduces deleteNotify", () => {
      const [deleteController, keepController] = [
        controllerFactory(),
        controllerFactory(),
      ];
      const initialState = controllerStateFactory({
        items: [deleteController, keepController],
      });

      expect(
        reducers(initialState, actions.deleteNotify(deleteController.id))
      ).toEqual(controllerStateFactory({ items: [keepController] }));
    });

    it("reduces deleteError", () => {
      const initialState = controllerStateFactory({
        errors: null,
        saving: true,
      });

      expect(
        reducers(
          initialState,
          actions.deleteError("Could not delete controller")
        )
      ).toEqual(
        controllerStateFactory({
          errors: "Could not delete controller",
          saving: false,
        })
      );
    });
  });
});

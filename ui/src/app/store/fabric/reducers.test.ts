import reducers, { actions } from "./slice";

import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
} from "testing/factories";

describe("fabric reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual(fabricStateFactory());
  });

  describe("fetch", () => {
    it("reduces fetchStart", () => {
      const initialState = fabricStateFactory({ loading: false });

      expect(reducers(initialState, actions.fetchStart())).toEqual(
        fabricStateFactory({ loading: true })
      );
    });

    it("reduces fetchSuccess", () => {
      const initialState = fabricStateFactory({
        items: [],
        loaded: false,
        loading: true,
      });
      const fabrics = [fabricFactory(), fabricFactory()];

      expect(reducers(initialState, actions.fetchSuccess(fabrics))).toEqual(
        fabricStateFactory({
          items: fabrics,
          loaded: true,
          loading: false,
        })
      );
    });

    it("reduces fetchError", () => {
      const initialState = fabricStateFactory({
        errors: null,
        loading: true,
      });

      expect(
        reducers(initialState, actions.fetchError("Could not fetch fabrics"))
      ).toEqual(
        fabricStateFactory({
          errors: "Could not fetch fabrics",
          loading: false,
        })
      );
    });
  });

  describe("create", () => {
    it("reduces createStart", () => {
      const initialState = fabricStateFactory({ saving: false });

      expect(reducers(initialState, actions.createStart())).toEqual(
        fabricStateFactory({ saving: true })
      );
    });

    it("reduces createSuccess", () => {
      const initialState = fabricStateFactory({
        saved: false,
        saving: true,
      });

      expect(reducers(initialState, actions.createSuccess())).toEqual(
        fabricStateFactory({ saved: true, saving: false })
      );
    });

    it("reduces createNotify", () => {
      const initialState = fabricStateFactory({
        items: [fabricFactory()],
      });
      const newfabric = fabricFactory();

      expect(reducers(initialState, actions.createNotify(newfabric))).toEqual(
        fabricStateFactory({
          items: [...initialState.items, newfabric],
        })
      );
    });

    it("reduces createError", () => {
      const initialState = fabricStateFactory({
        errors: null,
        saving: true,
      });

      expect(
        reducers(initialState, actions.createError("Could not create fabric"))
      ).toEqual(
        fabricStateFactory({
          errors: "Could not create fabric",
          saving: false,
        })
      );
    });
  });

  describe("update", () => {
    it("reduces updateStart", () => {
      const initialState = fabricStateFactory({ saving: false });

      expect(reducers(initialState, actions.updateStart())).toEqual(
        fabricStateFactory({ saving: true })
      );
    });

    it("reduces updateSuccess", () => {
      const initialState = fabricStateFactory({
        saved: false,
        saving: true,
      });

      expect(reducers(initialState, actions.updateSuccess())).toEqual(
        fabricStateFactory({ saved: true, saving: false })
      );
    });

    it("reduces updateNotify", () => {
      const initialState = fabricStateFactory({
        items: [fabricFactory()],
      });
      const updatedFabric = fabricFactory({
        id: initialState.items[0].id,
        name: "updated-fabric",
      });

      expect(
        reducers(initialState, actions.updateNotify(updatedFabric))
      ).toEqual(fabricStateFactory({ items: [updatedFabric] }));
    });

    it("reduces updateError", () => {
      const initialState = fabricStateFactory({
        errors: null,
        saving: true,
      });

      expect(
        reducers(initialState, actions.updateError("Could not update fabric"))
      ).toEqual(
        fabricStateFactory({
          errors: "Could not update fabric",
          saving: false,
        })
      );
    });
  });

  describe("delete", () => {
    it("reduces deleteStart", () => {
      const initialState = fabricStateFactory({ saving: false });

      expect(reducers(initialState, actions.deleteStart())).toEqual(
        fabricStateFactory({ saving: true })
      );
    });

    it("reduces deleteSuccess", () => {
      const initialState = fabricStateFactory({
        saved: false,
        saving: true,
      });

      expect(reducers(initialState, actions.deleteSuccess())).toEqual(
        fabricStateFactory({ saved: true, saving: false })
      );
    });

    it("reduces deleteNotify", () => {
      const [deleteFabric, keepFabric] = [fabricFactory(), fabricFactory()];
      const initialState = fabricStateFactory({
        items: [deleteFabric, keepFabric],
      });

      expect(
        reducers(initialState, actions.deleteNotify(deleteFabric.id))
      ).toEqual(fabricStateFactory({ items: [keepFabric] }));
    });

    it("reduces deleteError", () => {
      const initialState = fabricStateFactory({
        errors: null,
        saving: true,
      });

      expect(
        reducers(initialState, actions.deleteError("Could not delete fabric"))
      ).toEqual(
        fabricStateFactory({
          errors: "Could not delete fabric",
          saving: false,
        })
      );
    });
  });
});

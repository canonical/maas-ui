import reducers, { actions } from "./slice";

import {
  space as spaceFactory,
  spaceState as spaceStateFactory,
} from "testing/factories";

describe("space reducer", () => {
  it("should return the initial state", () => {
    const initialState = undefined;

    expect(reducers(initialState, { type: "" })).toEqual({
      ...spaceStateFactory(),
      errors: null,
    });
  });

  describe("fetch", () => {
    it("reduces fetchStart", () => {
      const initialState = spaceStateFactory({ loading: false });

      expect(reducers(initialState, actions.fetchStart())).toEqual(
        spaceStateFactory({ loading: true })
      );
    });

    it("reduces fetchSuccess", () => {
      const initialState = spaceStateFactory({
        items: [],
        loaded: false,
        loading: true,
      });
      const spaces = [spaceFactory(), spaceFactory()];

      expect(reducers(initialState, actions.fetchSuccess(spaces))).toEqual(
        spaceStateFactory({ items: spaces, loaded: true, loading: false })
      );
    });

    it("reduces fetchError", () => {
      const initialState = spaceStateFactory({ errors: "", loading: true });

      expect(
        reducers(initialState, actions.fetchError("Could not fetch spaces"))
      ).toEqual(
        spaceStateFactory({ errors: "Could not fetch spaces", loading: false })
      );
    });
  });

  describe("create", () => {
    it("reduces createStart", () => {
      const initialState = spaceStateFactory({ saving: false });

      expect(reducers(initialState, actions.createStart())).toEqual(
        spaceStateFactory({ saving: true })
      );
    });

    it("reduces createSuccess", () => {
      const initialState = spaceStateFactory({
        saved: false,
        saving: true,
      });

      expect(reducers(initialState, actions.createSuccess())).toEqual(
        spaceStateFactory({ saved: true, saving: false })
      );
    });

    it("reduces createNotify", () => {
      const initialState = spaceStateFactory({
        items: [spaceFactory()],
      });
      const newSpace = spaceFactory();

      expect(reducers(initialState, actions.createNotify(newSpace))).toEqual(
        spaceStateFactory({ items: [...initialState.items, newSpace] })
      );
    });

    it("reduces createError", () => {
      const initialState = spaceStateFactory({ errors: "", saving: true });

      expect(
        reducers(initialState, actions.createError("Could not create space"))
      ).toEqual(
        spaceStateFactory({
          errors: "Could not create space",
          saving: false,
        })
      );
    });
  });

  describe("update", () => {
    it("reduces updateStart", () => {
      const initialState = spaceStateFactory({ saving: false });

      expect(reducers(initialState, actions.updateStart())).toEqual(
        spaceStateFactory({ saving: true })
      );
    });

    it("reduces updateSuccess", () => {
      const initialState = spaceStateFactory({
        saved: false,
        saving: true,
      });

      expect(reducers(initialState, actions.updateSuccess())).toEqual(
        spaceStateFactory({ saved: true, saving: false })
      );
    });

    it("reduces updateNotify", () => {
      const initialState = spaceStateFactory({
        items: [spaceFactory()],
      });
      const updatedSpace = spaceFactory({
        id: initialState.items[0].id,
        name: "updated-reducers",
      });

      expect(
        reducers(initialState, actions.updateNotify(updatedSpace))
      ).toEqual(spaceStateFactory({ items: [updatedSpace] }));
    });

    it("reduces updateError", () => {
      const initialState = spaceStateFactory({ errors: "", saving: true });

      expect(
        reducers(initialState, actions.updateError("Could not update space"))
      ).toEqual(
        spaceStateFactory({
          errors: "Could not update space",
          saving: false,
        })
      );
    });
  });

  describe("delete", () => {
    it("reduces deleteStart", () => {
      const initialState = spaceStateFactory({ saving: false });

      expect(reducers(initialState, actions.deleteStart())).toEqual(
        spaceStateFactory({ saving: true })
      );
    });

    it("reduces deleteSuccess", () => {
      const initialState = spaceStateFactory({
        saved: false,
        saving: true,
      });

      expect(reducers(initialState, actions.deleteSuccess())).toEqual(
        spaceStateFactory({ saved: true, saving: false })
      );
    });

    it("reduces deleteNotify", () => {
      const [deleteSpace, keepSpace] = [spaceFactory(), spaceFactory()];
      const initialState = spaceStateFactory({
        items: [deleteSpace, keepSpace],
      });

      expect(
        reducers(initialState, actions.deleteNotify(deleteSpace.id))
      ).toEqual(spaceStateFactory({ items: [keepSpace] }));
    });

    it("reduces deleteError", () => {
      const initialState = spaceStateFactory({ errors: "", saving: true });

      expect(
        reducers(initialState, actions.deleteError("Could not delete space"))
      ).toEqual(
        spaceStateFactory({
          errors: "Could not delete space",
          saving: false,
        })
      );
    });
  });

  describe("get", () => {
    it("reduces getStart", () => {
      const initialState = spaceStateFactory({ loading: false });

      expect(reducers(initialState, actions.getStart())).toEqual(
        spaceStateFactory({ loading: true })
      );
    });

    it("reduces getError", () => {
      const initialState = spaceStateFactory({ errors: null, loading: true });

      expect(
        reducers(initialState, actions.getError({ id: "id was not supplied" }))
      ).toEqual(
        spaceStateFactory({
          errors: { id: "id was not supplied" },
          loading: false,
        })
      );
    });

    it("reduces getSuccess when space already exists in state", () => {
      const initialState = spaceStateFactory({
        items: [spaceFactory({ id: 0, name: "space-1" })],
        loading: true,
      });
      const updatedSpace = spaceFactory({
        id: 0,
        name: "space-1-new",
      });

      expect(reducers(initialState, actions.getSuccess(updatedSpace))).toEqual(
        spaceStateFactory({
          items: [updatedSpace],
          loading: false,
        })
      );
    });

    it("reduces getSuccess when space does not exist yet in state", () => {
      const initialState = spaceStateFactory({
        items: [spaceFactory({ id: 0 })],
        loading: true,
      });
      const newSpace = spaceFactory({ id: 1 });

      expect(reducers(initialState, actions.getSuccess(newSpace))).toEqual(
        spaceStateFactory({
          items: [...initialState.items, newSpace],
          loading: false,
        })
      );
    });
  });

  describe("setActive", () => {
    it("reduces setActiveSuccess", () => {
      const initialState = spaceStateFactory({ active: null });

      expect(
        reducers(
          initialState,
          actions.setActiveSuccess(spaceFactory({ id: 0 }))
        )
      ).toEqual(spaceStateFactory({ active: 0 }));
    });

    it("reduces setActiveError", () => {
      const initialState = spaceStateFactory({
        active: 0,
        errors: null,
      });

      expect(
        reducers(initialState, actions.setActiveError("Space does not exist"))
      ).toEqual(
        spaceStateFactory({
          active: null,
          errors: "Space does not exist",
        })
      );
    });
  });
});

import {
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";
import reducers, { actions } from "./slice";

describe("vlan reducer", () => {
  describe("initial", () => {
    it("returns the initial state", () => {
      const initialState = undefined;

      expect(reducers(initialState, { type: "" })).toEqual({
        errors: null,
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      });
    });
  });

  describe("fetch", () => {
    it("reduces fetchStart", () => {
      const initialState = vlanStateFactory({ loading: false });

      expect(reducers(initialState, actions.fetchStart())).toEqual(
        vlanStateFactory({ loading: true })
      );
    });

    it("reduces fetchSuccess", () => {
      const initialState = vlanStateFactory({
        items: [],
        loaded: false,
        loading: true,
      });
      const vlans = [vlanFactory(), vlanFactory()];

      expect(reducers(initialState, actions.fetchSuccess(vlans))).toEqual(
        vlanStateFactory({ items: vlans, loaded: true, loading: false })
      );
    });

    it("reduces fetchError", () => {
      const initialState = vlanStateFactory({ errors: "", loading: true });

      expect(
        reducers(initialState, actions.fetchError("Could not fetch vlans"))
      ).toEqual(vlanStateFactory({ errors: "Could not fetch vlans" }));
    });
  });

  describe("create", () => {
    it("reduces createStart", () => {
      const initialState = vlanStateFactory({ saving: false });

      expect(reducers(initialState, actions.createStart())).toEqual(
        vlanStateFactory({ saving: true })
      );
    });

    it("reduces createSuccess", () => {
      const initialState = vlanStateFactory({
        saved: false,
        saving: true,
      });

      expect(reducers(initialState, actions.createSuccess())).toEqual(
        vlanStateFactory({ errors: null, saved: true, saving: false })
      );
    });

    it("reduces createNotify", () => {
      const initialState = vlanStateFactory({
        items: [vlanFactory()],
      });
      const newVLAN = vlanFactory();

      expect(reducers(initialState, actions.createNotify(newVLAN))).toEqual(
        vlanStateFactory({ items: [...initialState.items, newVLAN] })
      );
    });

    it("reduces createError", () => {
      const initialState = vlanStateFactory({ errors: "", saving: true });

      expect(
        reducers(initialState, actions.createError("Could not create vlan"))
      ).toEqual(
        vlanStateFactory({ errors: "Could not create vlan", saving: false })
      );
    });
  });

  describe("update", () => {
    it("reduces updateStart", () => {
      const initialState = vlanStateFactory({ saving: false });

      expect(reducers(initialState, actions.updateStart())).toEqual(
        vlanStateFactory({ saving: true })
      );
    });

    it("reduces updateSuccess", () => {
      const initialState = vlanStateFactory({
        saved: false,
        saving: true,
      });

      expect(reducers(initialState, actions.updateSuccess())).toEqual(
        vlanStateFactory({ errors: null, saved: true, saving: false })
      );
    });

    it("reduces updateNotify ", () => {
      const initialState = vlanStateFactory({
        items: [vlanFactory()],
      });
      const updatedVLAN = vlanFactory({
        id: initialState.items[0].id,
        name: "updated-vlan",
      });

      expect(reducers(initialState, actions.updateNotify(updatedVLAN))).toEqual(
        vlanStateFactory({ items: [updatedVLAN] })
      );
    });

    it("reduces updateError", () => {
      const initialState = vlanStateFactory({ errors: "", saving: true });

      expect(
        reducers(initialState, actions.updateError("Could not update vlan"))
      ).toEqual(
        vlanStateFactory({ errors: "Could not update vlan", saving: false })
      );
    });
  });

  describe("delete", () => {
    it("reduces deleteStart", () => {
      const initialState = vlanStateFactory({ saving: false });

      expect(reducers(initialState, actions.deleteStart())).toEqual(
        vlanStateFactory({ saving: true })
      );
    });

    it("reduces deleteSuccess", () => {
      const initialState = vlanStateFactory({
        saved: false,
        saving: true,
      });

      expect(reducers(initialState, actions.deleteSuccess())).toEqual(
        vlanStateFactory({ errors: null, saved: true, saving: false })
      );
    });

    it("reduces deleteNotify", () => {
      const [deleteVLAN, keepVLAN] = [vlanFactory(), vlanFactory()];
      const initialState = vlanStateFactory({
        items: [deleteVLAN, keepVLAN],
      });

      expect(
        reducers(initialState, actions.deleteNotify(deleteVLAN.id))
      ).toEqual(vlanStateFactory({ items: [keepVLAN] }));
    });

    it("reduces deleteError", () => {
      const initialState = vlanStateFactory({ errors: "", saving: true });

      expect(
        reducers(initialState, actions.deleteError("Could not delete vlan"))
      ).toEqual(
        vlanStateFactory({ errors: "Could not delete vlan", saving: false })
      );
    });
  });
});

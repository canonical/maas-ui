import {
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";
import vlan from "./vlan";

describe("vlan reducer", () => {
  it("should return the initial state", () => {
    const initialState = undefined;

    expect(vlan(initialState, { type: "" })).toEqual(vlanStateFactory());
  });

  it("should correctly reduce FETCH_VLAN_START", () => {
    const initialState = vlanStateFactory({ loading: false });

    expect(
      vlan(initialState, {
        type: "FETCH_VLAN_START",
      })
    ).toEqual(vlanStateFactory({ loading: true }));
  });

  it("should correctly reduce FETCH_VLAN_SUCCESS", () => {
    const initialState = vlanStateFactory({
      items: [],
      loaded: false,
      loading: true,
    });
    const vlans = [vlanFactory(), vlanFactory()];

    expect(
      vlan(initialState, {
        type: "FETCH_VLAN_SUCCESS",
        payload: vlans,
      })
    ).toEqual(vlanStateFactory({ items: vlans, loaded: true, loading: false }));
  });

  it("should correctly reduce FETCH_VLAN_ERROR", () => {
    const initialState = vlanStateFactory({ errors: "", loading: true });

    expect(
      vlan(initialState, {
        error: "Could not fetch vlans",
        type: "FETCH_VLAN_ERROR",
      })
    ).toEqual(
      vlanStateFactory({ errors: "Could not fetch vlans", loading: false })
    );
  });

  it("should correctly reduce CREATE_VLAN_START", () => {
    const initialState = vlanStateFactory({ saving: false });

    expect(
      vlan(initialState, {
        type: "CREATE_VLAN_START",
      })
    ).toEqual(vlanStateFactory({ saving: true }));
  });

  it("should correctly reduce CREATE_VLAN_SUCCESS", () => {
    const initialState = vlanStateFactory({
      saved: false,
      saving: true,
    });

    expect(
      vlan(initialState, {
        type: "CREATE_VLAN_SUCCESS",
      })
    ).toEqual(vlanStateFactory({ saved: true, saving: false }));
  });

  it("should correctly reduce CREATE_VLAN_NOTIFY", () => {
    const initialState = vlanStateFactory({
      items: [vlanFactory()],
    });
    const newVLAN = vlanFactory();

    expect(
      vlan(initialState, {
        type: "CREATE_VLAN_NOTIFY",
        payload: newVLAN,
      })
    ).toEqual(vlanStateFactory({ items: [...initialState.items, newVLAN] }));
  });

  it("should correctly reduce CREATE_VLAN_ERROR", () => {
    const initialState = vlanStateFactory({ errors: "", saving: true });

    expect(
      vlan(initialState, {
        error: "Could not create vlan",
        type: "CREATE_VLAN_ERROR",
      })
    ).toEqual(
      vlanStateFactory({ errors: "Could not create vlan", saving: false })
    );
  });

  it("should correctly reduce UPDATE_VLAN_START", () => {
    const initialState = vlanStateFactory({ saving: false });

    expect(
      vlan(initialState, {
        type: "UPDATE_VLAN_START",
      })
    ).toEqual(vlanStateFactory({ saving: true }));
  });

  it("should correctly reduce UPDATE_VLAN_SUCCESS", () => {
    const initialState = vlanStateFactory({
      saved: false,
      saving: true,
    });

    expect(
      vlan(initialState, {
        type: "UPDATE_VLAN_SUCCESS",
      })
    ).toEqual(vlanStateFactory({ saved: true, saving: false }));
  });

  it("should correctly reduce UPDATE_VLAN_NOTIFY", () => {
    const initialState = vlanStateFactory({
      items: [vlanFactory()],
    });
    const updatedVLAN = vlanFactory({
      id: initialState.items[0].id,
      name: "updated-vlan",
    });

    expect(
      vlan(initialState, {
        type: "UPDATE_VLAN_NOTIFY",
        payload: updatedVLAN,
      })
    ).toEqual(vlanStateFactory({ items: [updatedVLAN] }));
  });

  it("should correctly reduce UPDATE_VLAN_ERROR", () => {
    const initialState = vlanStateFactory({ errors: "", saving: true });

    expect(
      vlan(initialState, {
        error: "Could not update vlan",
        type: "UPDATE_VLAN_ERROR",
      })
    ).toEqual(
      vlanStateFactory({ errors: "Could not update vlan", saving: false })
    );
  });

  it("should correctly reduce DELETE_VLAN_START", () => {
    const initialState = vlanStateFactory({ saving: false });

    expect(
      vlan(initialState, {
        type: "DELETE_VLAN_START",
      })
    ).toEqual(vlanStateFactory({ saving: true }));
  });

  it("should correctly reduce DELETE_VLAN_SUCCESS", () => {
    const initialState = vlanStateFactory({
      saved: false,
      saving: true,
    });

    expect(
      vlan(initialState, {
        type: "DELETE_VLAN_SUCCESS",
      })
    ).toEqual(vlanStateFactory({ saved: true, saving: false }));
  });

  it("should correctly reduce DELETE_VLAN_NOTIFY", () => {
    const [deleteVLAN, keepVLAN] = [vlanFactory(), vlanFactory()];
    const initialState = vlanStateFactory({
      items: [deleteVLAN, keepVLAN],
    });

    expect(
      vlan(initialState, {
        type: "DELETE_VLAN_NOTIFY",
        payload: deleteVLAN.id,
      })
    ).toEqual(vlanStateFactory({ items: [keepVLAN] }));
  });

  it("should correctly reduce DELETE_VLAN_ERROR", () => {
    const initialState = vlanStateFactory({ errors: "", saving: true });

    expect(
      vlan(initialState, {
        error: "Could not delete vlan",
        type: "DELETE_VLAN_ERROR",
      })
    ).toEqual(
      vlanStateFactory({ errors: "Could not delete vlan", saving: false })
    );
  });
});

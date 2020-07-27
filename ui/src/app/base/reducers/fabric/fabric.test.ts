import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
} from "testing/factories";
import fabric from "./fabric";

describe("fabric reducer", () => {
  it("should return the initial state", () => {
    const initialState = undefined;

    expect(fabric(initialState, { type: "" })).toEqual(fabricStateFactory());
  });

  it("should correctly reduce FETCH_FABRIC_START", () => {
    const initialState = fabricStateFactory({ loading: false });

    expect(
      fabric(initialState, {
        type: "FETCH_FABRIC_START",
      })
    ).toEqual(fabricStateFactory({ loading: true }));
  });

  it("should correctly reduce FETCH_FABRIC_SUCCESS", () => {
    const initialState = fabricStateFactory({
      items: [],
      loaded: false,
      loading: true,
    });
    const fabrics = [fabricFactory(), fabricFactory()];

    expect(
      fabric(initialState, {
        type: "FETCH_FABRIC_SUCCESS",
        payload: fabrics,
      })
    ).toEqual(
      fabricStateFactory({ items: fabrics, loaded: true, loading: false })
    );
  });

  it("should correctly reduce FETCH_FABRIC_ERROR", () => {
    const initialState = fabricStateFactory({ errors: "", loading: true });

    expect(
      fabric(initialState, {
        error: "Could not fetch fabrics",
        type: "FETCH_FABRIC_ERROR",
      })
    ).toEqual(
      fabricStateFactory({ errors: "Could not fetch fabrics", loading: false })
    );
  });

  it("should correctly reduce CREATE_FABRIC_START", () => {
    const initialState = fabricStateFactory({ saving: false });

    expect(
      fabric(initialState, {
        type: "CREATE_FABRIC_START",
      })
    ).toEqual(fabricStateFactory({ saving: true }));
  });

  it("should correctly reduce CREATE_FABRIC_SUCCESS", () => {
    const initialState = fabricStateFactory({
      saved: false,
      saving: true,
    });

    expect(
      fabric(initialState, {
        type: "CREATE_FABRIC_SUCCESS",
      })
    ).toEqual(fabricStateFactory({ saved: true, saving: false }));
  });

  it("should correctly reduce CREATE_FABRIC_NOTIFY", () => {
    const initialState = fabricStateFactory({
      items: [fabricFactory()],
    });
    const newFabric = fabricFactory();

    expect(
      fabric(initialState, {
        type: "CREATE_FABRIC_NOTIFY",
        payload: newFabric,
      })
    ).toEqual(
      fabricStateFactory({ items: [...initialState.items, newFabric] })
    );
  });

  it("should correctly reduce CREATE_FABRIC_ERROR", () => {
    const initialState = fabricStateFactory({ errors: "", saving: true });

    expect(
      fabric(initialState, {
        error: "Could not create fabric",
        type: "CREATE_FABRIC_ERROR",
      })
    ).toEqual(
      fabricStateFactory({ errors: "Could not create fabric", saving: false })
    );
  });

  it("should correctly reduce UPDATE_FABRIC_START", () => {
    const initialState = fabricStateFactory({ saving: false });

    expect(
      fabric(initialState, {
        type: "UPDATE_FABRIC_START",
      })
    ).toEqual(fabricStateFactory({ saving: true }));
  });

  it("should correctly reduce UPDATE_FABRIC_SUCCESS", () => {
    const initialState = fabricStateFactory({
      saved: false,
      saving: true,
    });

    expect(
      fabric(initialState, {
        type: "UPDATE_FABRIC_SUCCESS",
      })
    ).toEqual(fabricStateFactory({ saved: true, saving: false }));
  });

  it("should correctly reduce UPDATE_FABRIC_NOTIFY", () => {
    const initialState = fabricStateFactory({
      items: [fabricFactory()],
    });
    const updatedFabric = fabricFactory({
      id: initialState.items[0].id,
      name: "updated-fabric",
    });

    expect(
      fabric(initialState, {
        type: "UPDATE_FABRIC_NOTIFY",
        payload: updatedFabric,
      })
    ).toEqual(fabricStateFactory({ items: [updatedFabric] }));
  });

  it("should correctly reduce UPDATE_FABRIC_ERROR", () => {
    const initialState = fabricStateFactory({ errors: "", saving: true });

    expect(
      fabric(initialState, {
        error: "Could not update fabric",
        type: "UPDATE_FABRIC_ERROR",
      })
    ).toEqual(
      fabricStateFactory({ errors: "Could not update fabric", saving: false })
    );
  });

  it("should correctly reduce DELETE_FABRIC_START", () => {
    const initialState = fabricStateFactory({ saving: false });

    expect(
      fabric(initialState, {
        type: "DELETE_FABRIC_START",
      })
    ).toEqual(fabricStateFactory({ saving: true }));
  });

  it("should correctly reduce DELETE_FABRIC_SUCCESS", () => {
    const initialState = fabricStateFactory({
      saved: false,
      saving: true,
    });

    expect(
      fabric(initialState, {
        type: "DELETE_FABRIC_SUCCESS",
      })
    ).toEqual(fabricStateFactory({ saved: true, saving: false }));
  });

  it("should correctly reduce DELETE_FABRIC_NOTIFY", () => {
    const [deleteFabric, keepFabric] = [fabricFactory(), fabricFactory()];
    const initialState = fabricStateFactory({
      items: [deleteFabric, keepFabric],
    });

    expect(
      fabric(initialState, {
        type: "DELETE_FABRIC_NOTIFY",
        payload: deleteFabric.id,
      })
    ).toEqual(fabricStateFactory({ items: [keepFabric] }));
  });

  it("should correctly reduce DELETE_FABRIC_ERROR", () => {
    const initialState = fabricStateFactory({ errors: "", saving: true });

    expect(
      fabric(initialState, {
        error: "Could not delete fabric",
        type: "DELETE_FABRIC_ERROR",
      })
    ).toEqual(
      fabricStateFactory({ errors: "Could not delete fabric", saving: false })
    );
  });
});

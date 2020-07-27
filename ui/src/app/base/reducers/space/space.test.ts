import {
  space as spaceFactory,
  spaceState as spaceStateFactory,
} from "testing/factories";
import space from "./space";

describe("space reducer", () => {
  it("should return the initial state", () => {
    const initialState = undefined;

    expect(space(initialState, { type: "" })).toEqual(spaceStateFactory());
  });

  it("should correctly reduce FETCH_SPACE_START", () => {
    const initialState = spaceStateFactory({ loading: false });

    expect(
      space(initialState, {
        type: "FETCH_SPACE_START",
      })
    ).toEqual(spaceStateFactory({ loading: true }));
  });

  it("should correctly reduce FETCH_SPACE_SUCCESS", () => {
    const initialState = spaceStateFactory({
      items: [],
      loaded: false,
      loading: true,
    });
    const spaces = [spaceFactory(), spaceFactory()];

    expect(
      space(initialState, {
        type: "FETCH_SPACE_SUCCESS",
        payload: spaces,
      })
    ).toEqual(
      spaceStateFactory({ items: spaces, loaded: true, loading: false })
    );
  });

  it("should correctly reduce FETCH_SPACE_ERROR", () => {
    const initialState = spaceStateFactory({ errors: "", loading: true });

    expect(
      space(initialState, {
        error: "Could not fetch spaces",
        type: "FETCH_SPACE_ERROR",
      })
    ).toEqual(
      spaceStateFactory({ errors: "Could not fetch spaces", loading: false })
    );
  });

  it("should correctly reduce CREATE_SPACE_START", () => {
    const initialState = spaceStateFactory({ saving: false });

    expect(
      space(initialState, {
        type: "CREATE_SPACE_START",
      })
    ).toEqual(spaceStateFactory({ saving: true }));
  });

  it("should correctly reduce CREATE_SPACE_SUCCESS", () => {
    const initialState = spaceStateFactory({
      saved: false,
      saving: true,
    });

    expect(
      space(initialState, {
        type: "CREATE_SPACE_SUCCESS",
      })
    ).toEqual(spaceStateFactory({ saved: true, saving: false }));
  });

  it("should correctly reduce CREATE_SPACE_NOTIFY", () => {
    const initialState = spaceStateFactory({
      items: [spaceFactory()],
    });
    const newSpace = spaceFactory();

    expect(
      space(initialState, {
        type: "CREATE_SPACE_NOTIFY",
        payload: newSpace,
      })
    ).toEqual(spaceStateFactory({ items: [...initialState.items, newSpace] }));
  });

  it("should correctly reduce CREATE_SPACE_ERROR", () => {
    const initialState = spaceStateFactory({ errors: "", saving: true });

    expect(
      space(initialState, {
        error: "Could not create space",
        type: "CREATE_SPACE_ERROR",
      })
    ).toEqual(
      spaceStateFactory({ errors: "Could not create space", saving: false })
    );
  });

  it("should correctly reduce UPDATE_SPACE_START", () => {
    const initialState = spaceStateFactory({ saving: false });

    expect(
      space(initialState, {
        type: "UPDATE_SPACE_START",
      })
    ).toEqual(spaceStateFactory({ saving: true }));
  });

  it("should correctly reduce UPDATE_SPACE_SUCCESS", () => {
    const initialState = spaceStateFactory({
      saved: false,
      saving: true,
    });

    expect(
      space(initialState, {
        type: "UPDATE_SPACE_SUCCESS",
      })
    ).toEqual(spaceStateFactory({ saved: true, saving: false }));
  });

  it("should correctly reduce UPDATE_SPACE_NOTIFY", () => {
    const initialState = spaceStateFactory({
      items: [spaceFactory()],
    });
    const updatedSpace = spaceFactory({
      id: initialState.items[0].id,
      name: "updated-space",
    });

    expect(
      space(initialState, {
        type: "UPDATE_SPACE_NOTIFY",
        payload: updatedSpace,
      })
    ).toEqual(spaceStateFactory({ items: [updatedSpace] }));
  });

  it("should correctly reduce UPDATE_SPACE_ERROR", () => {
    const initialState = spaceStateFactory({ errors: "", saving: true });

    expect(
      space(initialState, {
        error: "Could not update space",
        type: "UPDATE_SPACE_ERROR",
      })
    ).toEqual(
      spaceStateFactory({ errors: "Could not update space", saving: false })
    );
  });

  it("should correctly reduce DELETE_SPACE_START", () => {
    const initialState = spaceStateFactory({ saving: false });

    expect(
      space(initialState, {
        type: "DELETE_SPACE_START",
      })
    ).toEqual(spaceStateFactory({ saving: true }));
  });

  it("should correctly reduce DELETE_SPACE_SUCCESS", () => {
    const initialState = spaceStateFactory({
      saved: false,
      saving: true,
    });

    expect(
      space(initialState, {
        type: "DELETE_SPACE_SUCCESS",
      })
    ).toEqual(spaceStateFactory({ saved: true, saving: false }));
  });

  it("should correctly reduce DELETE_SPACE_NOTIFY", () => {
    const [deleteSpace, keepSpace] = [spaceFactory(), spaceFactory()];
    const initialState = spaceStateFactory({
      items: [deleteSpace, keepSpace],
    });

    expect(
      space(initialState, {
        type: "DELETE_SPACE_NOTIFY",
        payload: deleteSpace.id,
      })
    ).toEqual(spaceStateFactory({ items: [keepSpace] }));
  });

  it("should correctly reduce DELETE_SPACE_ERROR", () => {
    const initialState = spaceStateFactory({ errors: "", saving: true });

    expect(
      space(initialState, {
        error: "Could not delete space",
        type: "DELETE_SPACE_ERROR",
      })
    ).toEqual(
      spaceStateFactory({ errors: "Could not delete space", saving: false })
    );
  });
});

import pod from "./pod";

describe("pod reducer", () => {
  it("should return the initial state", () => {
    expect(pod(undefined, { type: "" })).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce FETCH_POD_START", () => {
    expect(
      pod(undefined, {
        type: "FETCH_POD_START",
      })
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: true,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce FETCH_POD_SUCCESS", () => {
    expect(
      pod(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true,
          saved: false,
          saving: false,
        },
        {
          type: "FETCH_POD_SUCCESS",
          payload: [
            { id: 1, name: "pod1" },
            { id: 2, name: "pod2" },
          ],
        }
      )
    ).toEqual({
      errors: {},
      loading: false,
      loaded: true,
      saved: false,
      saving: false,

      items: [
        { id: 1, name: "pod1" },
        { id: 2, name: "pod2" },
      ],
    });
  });

  it("should correctly reduce FETCH_POD_ERROR", () => {
    expect(
      pod(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
        },
        {
          error: "Could not fetch pods",
          type: "FETCH_POD_ERROR",
        }
      )
    ).toEqual({
      errors: "Could not fetch pods",
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce CREATE_POD_START", () => {
    expect(
      pod(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false,
        },
        {
          type: "CREATE_POD_START",
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: true,
    });
  });

  it("should correctly reduce CREATE_POD_ERROR", () => {
    expect(
      pod(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
        },
        {
          error: { name: "Pod name already exists" },
          type: "CREATE_POD_ERROR",
        }
      )
    ).toEqual({
      errors: { name: "Pod name already exists" },
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce CREATE_POD_NOTIFY", () => {
    expect(
      pod(
        {
          errors: {},
          items: [{ id: 1, name: "pod1" }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
        },
        {
          payload: { id: 2, name: "pod2" },
          type: "CREATE_POD_NOTIFY",
        }
      )
    ).toEqual({
      errors: {},
      items: [
        { id: 1, name: "pod1" },
        { id: 2, name: "pod2" },
      ],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });
});

import tag from "./tag";

describe("tag reducer", () => {
  it("should return the initial state", () => {
    expect(tag(undefined, {})).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce FETCH_TAG_START", () => {
    expect(
      tag(undefined, {
        type: "FETCH_TAG_START",
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

  it("should correctly reduce FETCH_TAG_SUCCESS", () => {
    const payload = [
      {
        id: 1,
        created: "Mon, 16 Sep. 2019 12:22:36",
        updated: "Mon, 16 Sep. 2019 12:22:36",
        name: "virtual",
        definition: "",
        comment: "",
        kernel_opts: null,
      },
    ];

    expect(
      tag(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true,
          saved: false,
          saving: false,
        },
        {
          type: "FETCH_TAG_SUCCESS",
          payload,
        }
      )
    ).toEqual({
      errors: {},
      items: payload,
      loading: false,
      loaded: true,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce FETCH_TAG_ERROR", () => {
    expect(
      tag(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
        },
        {
          error: "Could not fetch tags",
          type: "FETCH_TAG_ERROR",
        }
      )
    ).toEqual({
      errors: "Could not fetch tags",
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });
});

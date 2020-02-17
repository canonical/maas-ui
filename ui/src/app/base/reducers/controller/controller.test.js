import controller from "./controller";

describe("controller reducer", () => {
  it("should return the initial state", () => {
    expect(controller(undefined, {})).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce FETCH_CONTROLLER_START", () => {
    expect(
      controller(undefined, {
        type: "FETCH_CONTROLLER_START"
      })
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: true,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce FETCH_CONTROLLER_SUCCESS", () => {
    expect(
      controller(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true,
          saved: false,
          saving: false
        },
        {
          type: "FETCH_CONTROLLER_SUCCESS",
          payload: [
            { id: 1, hostname: "rack" },
            { id: 2, hostname: "maas" }
          ]
        }
      )
    ).toEqual({
      errors: {},
      loading: false,
      loaded: true,
      items: [
        { id: 1, hostname: "rack" },
        { id: 2, hostname: "maas" }
      ],
      saved: false,
      saving: false
    });
  });
});

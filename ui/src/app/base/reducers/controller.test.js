import controller from "./controller";

describe("controller reducer", () => {
  it("should return the initial state", () => {
    expect(controller(undefined, {})).toEqual({
      items: [],
      loaded: false,
      loading: false
    });
  });

  it("should correctly reduce FETCH_CONTROLLER_START", () => {
    expect(
      controller(undefined, {
        type: "FETCH_CONTROLLER_START"
      })
    ).toEqual({
      items: [],
      loaded: false,
      loading: true
    });
  });

  it("should correctly reduce FETCH_CONTROLLER_SUCCESS", () => {
    expect(
      controller(
        {
          items: [],
          loaded: false,
          loading: true
        },
        {
          type: "FETCH_CONTROLLER_SUCCESS",
          payload: [{ id: 1, hostname: "rack" }, { id: 2, hostname: "maas" }]
        }
      )
    ).toEqual({
      loading: false,
      loaded: true,
      items: [{ id: 1, hostname: "rack" }, { id: 2, hostname: "maas" }]
    });
  });
});

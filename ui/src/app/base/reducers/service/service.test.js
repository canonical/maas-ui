import service from "./service";

describe("service reducer", () => {
  it("should return the initial state", () => {
    expect(service(undefined, {})).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce FETCH_SERVICE_START", () => {
    expect(
      service(undefined, {
        type: "FETCH_SERVICE_START"
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

  it("should correctly reduce FETCH_SERVICE_SUCCESS", () => {
    const payload = [
      {
        id: 1,
        name: "ntp_rack",
        status: "dead",
        status_info: ""
      },
      {
        id: 2,
        name: "http",
        status: "unknown",
        status_info: ""
      }
    ];
    expect(
      service(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true,
          saved: false,
          saving: false
        },
        {
          type: "FETCH_SERVICE_SUCCESS",
          payload
        }
      )
    ).toEqual({
      errors: {},
      items: payload,
      loading: false,
      loaded: true,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce FETCH_SERVICE_ERROR", () => {
    expect(
      service(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: false
        },
        {
          error: "Could not fetch services",
          type: "FETCH_SERVICE_ERROR"
        }
      )
    ).toEqual({
      errors: "Could not fetch services",
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });
});

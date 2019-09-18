import zone from "./zone";

describe("zone reducer", () => {
  it("should return the initial state", () => {
    expect(zone(undefined, {})).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false
    });
  });

  it("should correctly reduce FETCH_ZONE_START", () => {
    expect(
      zone(undefined, {
        type: "FETCH_ZONE_START"
      })
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: true
    });
  });

  it("should correctly reduce FETCH_ZONE_SUCCESS", () => {
    const payload = [
      {
        id: 1,
        created: "Mon, 16 Sep. 2019 12:19:56",
        updated: "Mon, 16 Sep. 2019 12:19:56",
        name: "default",
        description: "",
        devices_count: 15,
        machines_count: 0,
        controllers_count: 0
      }
    ];
    expect(
      zone(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true
        },
        {
          type: "FETCH_ZONE_SUCCESS",
          payload
        }
      )
    ).toEqual({
      errors: {},
      items: payload,
      loading: false,
      loaded: true
    });
  });

  it("should correctly reduce FETCH_ZONE_ERROR", () => {
    expect(
      zone(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false
        },
        {
          error: "Could not fetch zones",
          type: "FETCH_ZONE_ERROR"
        }
      )
    ).toEqual({
      errors: "Could not fetch zones",
      items: [],
      loaded: false,
      loading: false
    });
  });
});

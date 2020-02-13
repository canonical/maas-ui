import device from "./device";

describe("device reducer", () => {
  it("should return the initial state", () => {
    expect(device(undefined, {})).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce FETCH_DEVICE_START", () => {
    expect(
      device(undefined, {
        type: "FETCH_DEVICE_START"
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

  it("should correctly reduce FETCH_DEVICE_SUCCESS", () => {
    expect(
      device(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true,
          saved: false,
          saving: false
        },
        {
          type: "FETCH_DEVICE_SUCCESS",
          payload: [
            { id: 1, hostname: "test1" },
            { id: 2, hostname: "test2" }
          ]
        }
      )
    ).toEqual({
      errors: {},
      loading: false,
      loaded: true,
      items: [
        { id: 1, hostname: "test1" },
        { id: 2, hostname: "test2" }
      ],
      saved: false,
      saving: false
    });
  });
});

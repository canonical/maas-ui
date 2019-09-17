import device from "./device";

describe("device reducer", () => {
  it("should return the initial state", () => {
    expect(device(undefined, {})).toEqual({
      items: [],
      loaded: false,
      loading: false
    });
  });

  it("should correctly reduce FETCH_DEVICE_START", () => {
    expect(
      device(undefined, {
        type: "FETCH_DEVICE_START"
      })
    ).toEqual({
      items: [],
      loaded: false,
      loading: true
    });
  });

  it("should correctly reduce FETCH_DEVICE_SUCCESS", () => {
    expect(
      device(
        {
          items: [],
          loaded: false,
          loading: true
        },
        {
          type: "FETCH_DEVICE_SUCCESS",
          payload: [{ id: 1, hostname: "test1" }, { id: 2, hostname: "test2" }]
        }
      )
    ).toEqual({
      loading: false,
      loaded: true,
      items: [{ id: 1, hostname: "test1" }, { id: 2, hostname: "test2" }]
    });
  });
});

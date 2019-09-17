import subnet from "./subnet";

describe("subnet reducer", () => {
  it("should return the initial state", () => {
    expect(subnet(undefined, {})).toEqual({
      items: [],
      loaded: false,
      loading: false
    });
  });

  it("should correctly reduce FETCH_SUBNET_START", () => {
    expect(
      subnet(undefined, {
        type: "FETCH_SUBNET_START"
      })
    ).toEqual({
      items: [],
      loaded: false,
      loading: true
    });
  });

  it("should correctly reduce FETCH_SUBNET_SUCCESS", () => {
    expect(
      subnet(
        {
          items: [],
          loaded: false,
          loading: true
        },
        {
          type: "FETCH_SUBNET_SUCCESS",
          payload: [{ id: 1, name: "10.0.0.99" }, { id: 2, name: "test.maas" }]
        }
      )
    ).toEqual({
      loading: false,
      loaded: true,
      items: [{ id: 1, name: "10.0.0.99" }, { id: 2, name: "test.maas" }]
    });
  });
});

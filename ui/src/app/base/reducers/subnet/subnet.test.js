import subnet from "./subnet";

describe("subnet reducer", () => {
  it("should return the initial state", () => {
    expect(subnet(undefined, {})).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce FETCH_SUBNET_START", () => {
    expect(
      subnet(undefined, {
        type: "FETCH_SUBNET_START"
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

  it("should correctly reduce FETCH_SUBNET_ERROR", () => {
    expect(
      subnet(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: false
        },
        {
          error: "Could not fetch subnets",
          type: "FETCH_SUBNET_ERROR"
        }
      )
    ).toEqual({
      errors: "Could not fetch subnets",
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false
    });
  });

  it("should correctly reduce FETCH_SUBNET_SUCCESS", () => {
    expect(
      subnet(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true,
          saved: false,
          saving: false
        },
        {
          type: "FETCH_SUBNET_SUCCESS",
          payload: [
            { id: 1, name: "10.0.0.99" },
            { id: 2, name: "test.maas" }
          ]
        }
      )
    ).toEqual({
      errors: {},
      loading: false,
      loaded: true,
      saved: false,
      saving: false,
      items: [
        { id: 1, name: "10.0.0.99" },
        { id: 2, name: "test.maas" }
      ]
    });
  });
});

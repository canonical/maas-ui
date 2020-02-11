import domain from "./domain";

describe("domain reducer", () => {
  it("should return the initial state", () => {
    expect(domain(undefined, {})).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false
    });
  });

  it("should correctly reduce FETCH_DOMAIN_START", () => {
    expect(
      domain(undefined, {
        type: "FETCH_DOMAIN_START"
      })
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: true
    });
  });

  it("should correctly reduce FETCH_DOMAIN_SUCCESS", () => {
    expect(
      domain(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true
        },
        {
          type: "FETCH_DOMAIN_SUCCESS",
          payload: [
            { id: 1, name: "rack" },
            { id: 2, name: "maas" }
          ]
        }
      )
    ).toEqual({
      errors: {},
      loading: false,
      loaded: true,
      items: [
        { id: 1, name: "rack" },
        { id: 2, name: "maas" }
      ]
    });
  });

  it("should correctly reduce FETCH_DOMAIN_ERROR", () => {
    expect(
      domain(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false
        },
        {
          error: "Could not fetch domains",
          type: "FETCH_DOMAIN_ERROR"
        }
      )
    ).toEqual({
      errors: "Could not fetch domains",
      items: [],
      loaded: false,
      loading: false
    });
  });
});

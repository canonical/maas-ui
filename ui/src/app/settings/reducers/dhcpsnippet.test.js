import dhcpsnippet from "./dhcpsnippet";

describe("dhcpsnippet reducer", () => {
  it("should return the initial state", () => {
    expect(dhcpsnippet(undefined, {})).toEqual({
      items: [],
      loaded: false,
      loading: false
    });
  });

  it("should correctly reduce FETCH_DHCPSNIPPET_START", () => {
    expect(
      dhcpsnippet(undefined, {
        type: "FETCH_DHCPSNIPPET_START"
      })
    ).toEqual({
      items: [],
      loaded: false,
      loading: true
    });
  });

  it("should correctly reduce FETCH_DHCPSNIPPET_SUCCESS", () => {
    expect(
      dhcpsnippet(
        {
          items: [],
          loaded: false,
          loading: true
        },
        {
          type: "FETCH_DHCPSNIPPET_SUCCESS",
          payload: [{ id: 1, name: "class" }, { id: 2, name: "lease" }]
        }
      )
    ).toEqual({
      loading: false,
      loaded: true,
      items: [{ id: 1, name: "class" }, { id: 2, name: "lease" }]
    });
  });
});

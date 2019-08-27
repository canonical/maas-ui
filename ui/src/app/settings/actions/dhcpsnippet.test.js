import dhcpsnippet from "./dhcpsnippet";

describe("dhcpsnippet actions", () => {
  it("should handle fetching dhcp snippets", () => {
    expect(dhcpsnippet.fetch()).toEqual({
      type: "FETCH_DHCPSNIPPET",
      meta: {
        model: "dhcpsnippet",
        method: "list"
      }
    });
  });
});

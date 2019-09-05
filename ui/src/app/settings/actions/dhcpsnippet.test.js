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

  it("can handle deleting dhcp snippets", () => {
    expect(dhcpsnippet.delete(808)).toEqual({
      type: "DELETE_DHCPSNIPPET",
      meta: {
        model: "dhcpsnippet",
        method: "delete"
      },
      payload: {
        params: {
          id: 808
        }
      }
    });
  });

  it("can handle cleaning dhcp snippets", () => {
    expect(dhcpsnippet.cleanup({ name: "kookaburra" })).toEqual({
      type: "CLEANUP_DHCPSNIPPET"
    });
  });
});

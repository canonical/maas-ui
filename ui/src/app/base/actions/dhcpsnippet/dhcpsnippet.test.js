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

  it("can handle creating dhcp snippets", () => {
    expect(dhcpsnippet.create({ name: "kangaroo" })).toEqual({
      type: "CREATE_DHCPSNIPPET",
      meta: {
        model: "dhcpsnippet",
        method: "create"
      },
      payload: {
        params: {
          name: "kangaroo"
        }
      }
    });
  });

  it("can handle updating dhcp snippets", () => {
    expect(dhcpsnippet.update({ name: "kookaburra" })).toEqual({
      type: "UPDATE_DHCPSNIPPET",
      meta: {
        model: "dhcpsnippet",
        method: "update"
      },
      payload: {
        params: {
          name: "kookaburra"
        }
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
    expect(dhcpsnippet.cleanup()).toEqual({
      type: "CLEANUP_DHCPSNIPPET"
    });
  });
});

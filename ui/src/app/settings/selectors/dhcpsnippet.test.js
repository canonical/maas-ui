import dhcpsnippet from "./dhcpsnippet";

describe("dhcpsnippet selectors", () => {
  it("can get all items", () => {
    const state = {
      dhcpsnippet: {
        items: [{ name: "lease" }]
      }
    };
    expect(dhcpsnippet.all(state)).toEqual([{ name: "lease" }]);
  });

  it("can get the loading state", () => {
    const state = {
      dhcpsnippet: {
        loading: true,
        items: []
      }
    };
    expect(dhcpsnippet.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = {
      dhcpsnippet: {
        loaded: true,
        items: []
      }
    };
    expect(dhcpsnippet.loaded(state)).toEqual(true);
  });

  it("can search items", () => {
    const state = {
      dhcpsnippet: {
        items: [
          {
            name: "class",
            description: "adds"
          },
          {
            name: "lease",
            description: "changes"
          },
          {
            name: "boot",
            description: "boots class"
          }
        ]
      }
    };
    expect(dhcpsnippet.search(state, "class")).toEqual([
      {
        name: "class",
        description: "adds"
      },
      {
        name: "boot",
        description: "boots class"
      }
    ]);
  });

  it("can get the count", () => {
    const state = {
      dhcpsnippet: {
        loading: true,
        items: [{ name: "class" }, { name: "lease" }]
      }
    };
    expect(dhcpsnippet.count(state)).toEqual(2);
  });
});

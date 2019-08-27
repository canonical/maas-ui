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
});

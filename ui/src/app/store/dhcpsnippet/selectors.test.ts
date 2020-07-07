import {
  dhcpSnippet as dhcpSnippetFactory,
  dhcpSnippetState as dhcpSnippetStateFactory,
} from "testing/factories";
import dhcpsnippet from "./selectors";

describe("dhcpsnippet selectors", () => {
  it("can get all items", () => {
    const items = [dhcpSnippetFactory(), dhcpSnippetFactory()];
    const state = {
      dhcpsnippet: dhcpSnippetStateFactory({
        items,
      }),
    };
    expect(dhcpsnippet.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state: TSFixMe = {
      dhcpsnippet: {
        loading: true,
        items: [],
      },
    };
    expect(dhcpsnippet.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state: TSFixMe = {
      dhcpsnippet: {
        loaded: true,
        items: [],
      },
    };
    expect(dhcpsnippet.loaded(state)).toEqual(true);
  });

  it("can search items", () => {
    const state: TSFixMe = {
      dhcpsnippet: {
        items: [
          {
            name: "class",
            description: "adds",
          },
          {
            name: "lease",
            description: "changes",
          },
          {
            name: "boot",
            description: "boots class",
          },
        ],
      },
    };
    expect(dhcpsnippet.search(state, "class")).toEqual([
      {
        name: "class",
        description: "adds",
      },
      {
        name: "boot",
        description: "boots class",
      },
    ]);
  });

  it("can get the count", () => {
    const state: TSFixMe = {
      dhcpsnippet: {
        loading: true,
        items: [{ name: "class" }, { name: "lease" }],
      },
    };
    expect(dhcpsnippet.count(state)).toEqual(2);
  });

  it("can get the saving state", () => {
    const state: TSFixMe = {
      dhcpsnippet: {
        saving: true,
        items: [],
      },
    };
    expect(dhcpsnippet.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state: TSFixMe = {
      dhcpsnippet: {
        saved: true,
        items: [],
      },
    };
    expect(dhcpsnippet.saved(state)).toEqual(true);
  });

  it("can get errors", () => {
    const state: TSFixMe = {
      dhcpsnippet: {
        errors: { name: "Name not provided" },
        items: [],
      },
    };
    expect(dhcpsnippet.errors(state)).toStrictEqual({
      name: "Name not provided",
    });
  });

  it("can get a dhcp snippet by id", () => {
    const state: TSFixMe = {
      dhcpsnippet: {
        loading: true,
        items: [
          { name: "class", id: 808 },
          { name: "lease", id: 909 },
        ],
      },
    };
    expect(dhcpsnippet.getById(state, 909)).toStrictEqual({
      name: "lease",
      id: 909,
    });
  });
});

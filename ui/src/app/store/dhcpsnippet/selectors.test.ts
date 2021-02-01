import dhcpsnippet from "./selectors";

import {
  dhcpSnippet as dhcpSnippetFactory,
  dhcpSnippetState as dhcpSnippetStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

describe("dhcpsnippet selectors", () => {
  it("can get all items", () => {
    const items = [dhcpSnippetFactory(), dhcpSnippetFactory()];
    const state = rootStateFactory({
      dhcpsnippet: dhcpSnippetStateFactory({
        items,
      }),
    });
    expect(dhcpsnippet.all(state)).toEqual(items);
  });

  it("can get the loading state", () => {
    const state = rootStateFactory({
      dhcpsnippet: dhcpSnippetStateFactory({
        loading: true,
      }),
    });
    expect(dhcpsnippet.loading(state)).toEqual(true);
  });

  it("can get the loaded state", () => {
    const state = rootStateFactory({
      dhcpsnippet: dhcpSnippetStateFactory({
        loaded: true,
      }),
    });
    expect(dhcpsnippet.loaded(state)).toEqual(true);
  });

  it("can search items", () => {
    const items = [
      dhcpSnippetFactory({
        name: "class",
      }),
      dhcpSnippetFactory(),
      dhcpSnippetFactory({
        description: "boots class",
      }),
    ];
    const state = rootStateFactory({
      dhcpsnippet: dhcpSnippetStateFactory({
        items,
      }),
    });
    expect(dhcpsnippet.search(state, "class")).toEqual([items[0], items[2]]);
  });

  it("can get the count", () => {
    const state = rootStateFactory({
      dhcpsnippet: dhcpSnippetStateFactory({
        loading: true,
        items: [dhcpSnippetFactory(), dhcpSnippetFactory()],
      }),
    });
    expect(dhcpsnippet.count(state)).toEqual(2);
  });

  it("can get the saving state", () => {
    const state = rootStateFactory({
      dhcpsnippet: dhcpSnippetStateFactory({
        saving: true,
      }),
    });
    expect(dhcpsnippet.saving(state)).toEqual(true);
  });

  it("can get the saved state", () => {
    const state = rootStateFactory({
      dhcpsnippet: dhcpSnippetStateFactory({
        saved: true,
      }),
    });
    expect(dhcpsnippet.saved(state)).toEqual(true);
  });

  it("can get errors", () => {
    const state = rootStateFactory({
      dhcpsnippet: dhcpSnippetStateFactory({
        errors: { name: "Name not provided" },
      }),
    });
    expect(dhcpsnippet.errors(state)).toStrictEqual({
      name: "Name not provided",
    });
  });

  it("can get a dhcp snippet by id", () => {
    const items = [
      dhcpSnippetFactory({ id: 808 }),
      dhcpSnippetFactory({ id: 909 }),
    ];
    const state = rootStateFactory({
      dhcpsnippet: dhcpSnippetStateFactory({
        loading: true,
        items,
      }),
    });
    expect(dhcpsnippet.getById(state, 909)).toStrictEqual(items[1]);
  });

  it("can get dhcp snippets for a node", () => {
    const items = [
      dhcpSnippetFactory({ id: 707, node: "abc123" }),
      dhcpSnippetFactory({ id: 808 }),
      dhcpSnippetFactory({ id: 909, node: "abc123" }),
    ];
    const state = rootStateFactory({
      dhcpsnippet: dhcpSnippetStateFactory({
        items,
      }),
    });
    expect(dhcpsnippet.getByNode(state, "abc123")).toStrictEqual([
      items[0],
      items[2],
    ]);
  });
});

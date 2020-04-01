import dhcpsnippet from "./dhcpsnippet";

describe("dhcpsnippet reducer", () => {
  it("should return the initial state", () => {
    expect(dhcpsnippet(undefined, {})).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce FETCH_DHCPSNIPPET_START", () => {
    expect(
      dhcpsnippet(undefined, {
        type: "FETCH_DHCPSNIPPET_START",
      })
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: true,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce FETCH_DHCPSNIPPET_SUCCESS", () => {
    expect(
      dhcpsnippet(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true,
          saved: false,
          saving: false,
        },
        {
          type: "FETCH_DHCPSNIPPET_SUCCESS",
          payload: [
            { id: 1, name: "class" },
            { id: 2, name: "lease" },
          ],
        }
      )
    ).toEqual({
      errors: {},
      items: [
        { id: 1, name: "class" },
        { id: 2, name: "lease" },
      ],
      loading: false,
      loaded: true,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce UPDATE_DHCPSNIPPET_START", () => {
    expect(
      dhcpsnippet(
        {
          auth: {},
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false,
        },
        {
          type: "UPDATE_DHCPSNIPPET_START",
        }
      )
    ).toEqual({
      auth: {},
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: true,
    });
  });

  it("should correctly reduce CREATE_DHCPSNIPPET_START", () => {
    expect(
      dhcpsnippet(
        {
          auth: {},
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false,
        },
        {
          type: "CREATE_DHCPSNIPPET_START",
        }
      )
    ).toEqual({
      auth: {},
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: true,
    });
  });

  it("should correctly reduce DELETE_DHCPSNIPPET_START", () => {
    expect(
      dhcpsnippet(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false,
        },
        {
          type: "DELETE_DHCPSNIPPET_START",
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: true,
    });
  });

  it("should correctly reduce UPDATE_DHCPSNIPPET_ERROR", () => {
    expect(
      dhcpsnippet(
        {
          auth: {},
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
        },
        {
          error: { name: "Name not provided" },
          type: "UPDATE_DHCPSNIPPET_ERROR",
        }
      )
    ).toEqual({
      auth: {},
      errors: { name: "Name not provided" },
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce CREATE_DHCPSNIPPET_ERROR", () => {
    expect(
      dhcpsnippet(
        {
          auth: {},
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
        },
        {
          error: { name: "Name not provided" },
          type: "CREATE_DHCPSNIPPET_ERROR",
        }
      )
    ).toEqual({
      auth: {},
      errors: { name: "Name not provided" },
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce DELETE_DHCPSNIPPET_ERROR", () => {
    expect(
      dhcpsnippet(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
        },
        {
          error: "Could not delete",
          type: "DELETE_DHCPSNIPPET_ERROR",
        }
      )
    ).toEqual({
      errors: "Could not delete",
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce UPDATE_DHCPSNIPPET_SUCCESS", () => {
    expect(
      dhcpsnippet(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true,
          saved: false,
          saving: false,
        },
        {
          type: "FETCH_DHCPSNIPPET_SUCCESS",
          payload: [
            { id: 1, name: "class" },
            { id: 2, name: "lease" },
          ],
        }
      )
    ).toEqual({
      errors: {},
      items: [
        { id: 1, name: "class" },
        { id: 2, name: "lease" },
      ],
      loading: false,
      loaded: true,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce CREATE_DHCPSNIPPET_SUCCESS", () => {
    expect(
      dhcpsnippet(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true,
          saved: false,
          saving: false,
        },
        {
          type: "FETCH_DHCPSNIPPET_SUCCESS",
          payload: [
            { id: 1, name: "class" },
            { id: 2, name: "lease" },
          ],
        }
      )
    ).toEqual({
      errors: {},
      items: [
        { id: 1, name: "class" },
        { id: 2, name: "lease" },
      ],
      loading: false,
      loaded: true,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce DELETE_DHCPSNIPPET_SUCCESS", () => {
    expect(
      dhcpsnippet(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true,
          saved: false,
          saving: false,
        },
        {
          type: "FETCH_DHCPSNIPPET_SUCCESS",
          payload: [
            { id: 1, name: "class" },
            { id: 2, name: "lease" },
          ],
        }
      )
    ).toEqual({
      errors: {},
      items: [
        { id: 1, name: "class" },
        { id: 2, name: "lease" },
      ],
      loading: false,
      loaded: true,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce UPDATE_DHCPSNIPPET_NOTIFY", () => {
    expect(
      dhcpsnippet(
        {
          auth: {},
          errors: {},
          items: [
            { id: 1, name: "class" },
            { id: 2, name: "lease" },
          ],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
        },
        {
          payload: {
            id: 1,
            name: "class2",
          },
          type: "UPDATE_DHCPSNIPPET_NOTIFY",
        }
      )
    ).toEqual({
      auth: {},
      errors: {},
      items: [
        { id: 1, name: "class2" },
        { id: 2, name: "lease" },
      ],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce CREATE_DHCPSNIPPET_NOTIFY", () => {
    expect(
      dhcpsnippet(
        {
          auth: {},
          errors: {},
          items: [{ id: 1, name: "class" }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
        },
        {
          payload: { id: 2, name: "lease" },
          type: "CREATE_DHCPSNIPPET_NOTIFY",
        }
      )
    ).toEqual({
      auth: {},
      errors: {},
      items: [
        { id: 1, name: "class" },
        { id: 2, name: "lease" },
      ],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce DELETE_DHCPSNIPPET_NOTIFY", () => {
    expect(
      dhcpsnippet(
        {
          errors: {},
          items: [
            { id: 1, name: "class" },
            { id: 2, name: "lease" },
          ],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
        },
        {
          payload: 2,
          type: "DELETE_DHCPSNIPPET_NOTIFY",
        }
      )
    ).toEqual({
      errors: {},
      items: [{ id: 1, name: "class" }],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce CLEANUP_DHCPSNIPPET", () => {
    expect(
      dhcpsnippet(
        {
          errors: { name: "Name not provided" },
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: true,
        },
        {
          type: "CLEANUP_DHCPSNIPPET",
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });
});

import reducers from "./slice";

import {
  licenseKeys as licenseKeysFactory,
  licenseKeysState as licenseKeysStateFactory,
} from "testing/factories";

describe("licenseKeys reducer", () => {
  it("should return the initial state", () => {
    expect(reducers(undefined, { type: "" })).toEqual(
      licenseKeysStateFactory({
        errors: null,
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      })
    );
  });

  it("should correctly reduce licensekeys/createStart", () => {
    expect(
      reducers(
        licenseKeysStateFactory({
          errors: null,
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false,
        }),
        {
          type: "licensekeys/createStart",
        }
      )
    ).toEqual(
      licenseKeysStateFactory({
        errors: null,
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: true,
      })
    );
  });

  it("should correctly reduce licensekeys/createSuccess", () => {
    expect(
      reducers(
        licenseKeysStateFactory({
          errors: null,
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
        }),
        {
          type: "licensekeys/createSuccess",
        }
      )
    ).toEqual(
      licenseKeysStateFactory({
        errors: null,
        items: [],
        loaded: false,
        loading: false,
        saved: true,
        saving: false,
      })
    );
  });

  it("should correctly reduce licensekeys/createError", () => {
    expect(
      reducers(
        licenseKeysStateFactory({
          errors: null,
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
        }),
        {
          errors: true,
          payload: { error: "Invalid license key." },
          type: "licensekeys/createError",
        }
      )
    ).toEqual(
      licenseKeysStateFactory({
        errors: { error: "Invalid license key." },
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      })
    );
  });

  it("should correctly reduce licensekeys/fetchStart", () => {
    expect(
      reducers(undefined, {
        type: "licensekeys/fetchStart",
      })
    ).toEqual(
      licenseKeysStateFactory({
        errors: null,
        items: [],
        loaded: false,
        loading: true,
      })
    );
  });

  it("should correctly reduce licensekeys/fetchError", () => {
    expect(
      reducers(undefined, {
        errors: true,
        payload: { error: "Unable to fetch license keys" },
        type: "licensekeys/fetchError",
      })
    ).toEqual(
      licenseKeysStateFactory({
        items: [],
        errors: { error: "Unable to fetch license keys" },
        loaded: false,
        loading: false,
      })
    );
  });

  it("should correctly reduce licensekeys/fetchSuccess", () => {
    const items = [
      licenseKeysFactory({ osystem: "windows", license_key: "foo" }),
      licenseKeysFactory({ osystem: "redhat", license_key: "bar" }),
    ];
    expect(
      reducers(
        licenseKeysStateFactory({
          items: [],
          loaded: false,
          loading: true,
        }),
        {
          type: "licensekeys/fetchSuccess",
          payload: items,
        }
      )
    ).toEqual(
      licenseKeysStateFactory({
        items,
        loaded: true,
        loading: false,
      })
    );
  });

  it("should correctly reduce licensekeys/updateStart", () => {
    expect(
      reducers(
        licenseKeysStateFactory({
          errors: null,
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false,
        }),
        {
          type: "licensekeys/updateStart",
        }
      )
    ).toEqual(
      licenseKeysStateFactory({
        errors: null,
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: true,
      })
    );
  });

  it("should correctly reduce licensekeys/updateSuccess", () => {
    const items = [
      licenseKeysFactory({
        osystem: "windows",
        distro_series: "2012",
        license_key: "foo",
      }),
      licenseKeysFactory({
        id: 1,
        osystem: "windows",
        distro_series: "2019",
        license_key: "bar",
      }),
    ];
    expect(
      reducers(
        licenseKeysStateFactory({
          errors: null,
          items,
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
        }),
        {
          type: "licensekeys/updateSuccess",
          payload: {
            ...items[1],
            osystem: "windows",
            distro_series: "2019",
            license_key: "baz",
          },
        }
      )
    ).toEqual(
      licenseKeysStateFactory({
        errors: null,
        items: [
          items[0],
          licenseKeysFactory({
            ...items[1],
            osystem: "windows",
            distro_series: "2019",
            license_key: "baz",
          }),
        ],
        loaded: false,
        loading: false,
        saved: true,
        saving: false,
      })
    );
  });

  it("should correctly reduce licensekeys/updateError", () => {
    expect(
      reducers(
        licenseKeysStateFactory({
          errors: null,
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
        }),
        {
          errors: true,
          payload: { error: "Not found" },
          type: "licensekeys/updateError",
        }
      )
    ).toEqual(
      licenseKeysStateFactory({
        errors: { error: "Not found" },
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      })
    );
  });

  it("should correctly reduce licensekeys/deleteStart", () => {
    expect(
      reducers(
        licenseKeysStateFactory({
          errors: null,
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false,
        }),
        {
          type: "licensekeys/deleteStart",
        }
      )
    ).toEqual(
      licenseKeysStateFactory({
        errors: null,
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: true,
      })
    );
  });

  it("should correctly reduce licensekeys/deleteSuccess", () => {
    const items = [
      licenseKeysFactory({
        osystem: "windows",
        distro_series: "2012",
        license_key: "foo",
      }),
      licenseKeysFactory({
        osystem: "windows",
        distro_series: "2019",
        license_key: "bar",
      }),
    ];
    expect(
      reducers(
        licenseKeysStateFactory({
          errors: null,
          items,
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
        }),
        {
          type: "licensekeys/deleteSuccess",
          payload: {
            osystem: "windows",
            distro_series: "2019",
            license_key: "bar",
          },
        }
      )
    ).toEqual(
      licenseKeysStateFactory({
        errors: null,
        items: [items[0]],
        loaded: false,
        loading: false,
        saved: true,
        saving: false,
      })
    );
  });

  it("should correctly reduce licensekeys/deleteError", () => {
    expect(
      reducers(
        licenseKeysStateFactory({
          errors: null,
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
        }),
        {
          errors: true,
          payload: { error: "Not found" },
          type: "licensekeys/deleteError",
        }
      )
    ).toEqual(
      licenseKeysStateFactory({
        errors: { error: "Not found" },
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      })
    );
  });
});

import licenseKeys from "./licensekeys";

describe("licenseKeys reducer", () => {
  it("should return the initial state", () => {
    expect(licenseKeys(undefined, {})).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
    });
  });

  it("should correctly reduce CREATE_LICENSE_KEY_START", () => {
    expect(
      licenseKeys(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false,
        },
        {
          type: "CREATE_LICENSE_KEY_START",
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

  it("should correctly reduce CREATE_LICENSE_KEY_SUCCESS", () => {
    expect(
      licenseKeys(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
        },
        {
          type: "CREATE_LICENSE_KEY_SUCCESS",
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: true,
      saving: false,
    });
  });

  it("should correctly reduce CREATE_LICENSE_KEY_ERROR", () => {
    expect(
      licenseKeys(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
        },
        {
          errors: { error: "Invalid license key." },
          type: "CREATE_LICENSE_KEY_ERROR",
        }
      )
    ).toEqual({
      errors: { error: "Invalid license key." },
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce FETCH_LICENSE_KEYS_START", () => {
    expect(
      licenseKeys(undefined, {
        type: "FETCH_LICENSE_KEYS_START",
      })
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: true,
    });
  });

  it("should correctly reduce FETCH_LICENSE_KEYS_ERROR", () => {
    expect(
      licenseKeys(undefined, {
        type: "FETCH_LICENSE_KEYS_ERROR",
        errors: { error: "Unable to fetch license keys" },
      })
    ).toEqual({
      items: [],
      errors: { error: "Unable to fetch license keys" },
      loaded: false,
      loading: false,
    });
  });

  it("should correctly reduce FETCH_LICENSE_KEYS_SUCCESS", () => {
    expect(
      licenseKeys(
        {
          items: [],
          loaded: false,
          loading: true,
        },
        {
          type: "FETCH_LICENSE_KEYS_SUCCESS",
          payload: [
            { osystem: "windows", license_key: "foo" },
            { osystem: "redhat", license_key: "bar" },
          ],
        }
      )
    ).toEqual({
      items: [
        { osystem: "windows", license_key: "foo" },
        { osystem: "redhat", license_key: "bar" },
      ],
      loaded: true,
      loading: false,
    });
  });

  it("should correctly reduce UPDATE_LICENSE_KEY_START", () => {
    expect(
      licenseKeys(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false,
        },
        {
          type: "UPDATE_LICENSE_KEY_START",
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

  it("should correctly reduce UPDATE_LICENSE_KEY_SUCCESS", () => {
    expect(
      licenseKeys(
        {
          errors: {},
          items: [
            { osystem: "windows", distro_series: "2012", license_key: "foo" },
            { osystem: "windows", distro_series: "2019", license_key: "bar" },
          ],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
        },
        {
          type: "UPDATE_LICENSE_KEY_SUCCESS",
          payload: {
            osystem: "windows",
            distro_series: "2019",
            license_key: "baz",
          },
        }
      )
    ).toEqual({
      errors: {},
      items: [
        { osystem: "windows", distro_series: "2012", license_key: "foo" },
        { osystem: "windows", distro_series: "2019", license_key: "baz" },
      ],
      loaded: false,
      loading: false,
      saved: true,
      saving: false,
    });
  });

  it("should correctly reduce UPDATE_LICENSE_KEY_ERROR", () => {
    expect(
      licenseKeys(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
        },
        {
          errors: { error: "Not found" },
          type: "UPDATE_LICENSE_KEY_ERROR",
        }
      )
    ).toEqual({
      errors: { error: "Not found" },
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });

  it("should correctly reduce DELETE_LICENSE_KEY_START", () => {
    expect(
      licenseKeys(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false,
        },
        {
          type: "DELETE_LICENSE_KEY_START",
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

  it("should correctly reduce DELETE_LICENSE_KEY_SUCCESS", () => {
    expect(
      licenseKeys(
        {
          errors: {},
          items: [
            { osystem: "windows", distro_series: "2012", license_key: "foo" },
            { osystem: "windows", distro_series: "2019", license_key: "bar" },
          ],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
        },
        {
          type: "DELETE_LICENSE_KEY_SUCCESS",
          payload: {
            osystem: "windows",
            distro_series: "2019",
            license_key: "bar",
          },
        }
      )
    ).toEqual({
      errors: {},
      items: [
        { osystem: "windows", distro_series: "2012", license_key: "foo" },
      ],
      loaded: false,
      loading: false,
      saved: true,
      saving: false,
    });
  });

  it("should correctly reduce DELETE_LICENSE_KEY_ERROR", () => {
    expect(
      licenseKeys(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
        },
        {
          errors: { error: "Not found" },
          type: "DELETE_LICENSE_KEY_ERROR",
        }
      )
    ).toEqual({
      errors: { error: "Not found" },
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
    });
  });
});

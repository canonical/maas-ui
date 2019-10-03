import licenseKeys from "./licensekeys";

describe("licenseKeys reducer", () => {
  it("should return the initial state", () => {
    expect(licenseKeys(undefined, {})).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false
    });
  });

  it("should correctly reduce FETCH_LICENSE_KEYS_START", () => {
    expect(
      licenseKeys(undefined, {
        type: "FETCH_LICENSE_KEYS_START"
      })
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: true
    });
  });

  it("should correctly reduce FETCH_LICENSE_KEYS_ERROR", () => {
    expect(
      licenseKeys(undefined, {
        type: "FETCH_LICENSE_KEYS_ERROR",
        errors: { error: "Unable to fetch license keys" }
      })
    ).toEqual({
      items: [],
      errors: { error: "Unable to fetch license keys" },
      loaded: false,
      loading: false
    });
  });

  it("should correctly reduce FETCH_LICENSE_KEYS_SUCCESS", () => {
    expect(
      licenseKeys(
        {
          items: [],
          loaded: false,
          loading: true
        },
        {
          type: "FETCH_LICENSE_KEYS_SUCCESS",
          payload: [
            { osystem: "windows", license_key: "foo" },
            { osystem: "redhat", license_key: "bar" }
          ]
        }
      )
    ).toEqual({
      items: [
        { osystem: "windows", license_key: "foo" },
        { osystem: "redhat", license_key: "bar" }
      ],
      loaded: true,
      loading: false
    });
  });
});

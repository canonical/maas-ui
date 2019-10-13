import licenseKeys from "./licensekeys";

describe("licenseKeys actions", () => {
  it("can create a license key", () => {
    const payload = {
      osystem: "windows",
      distro_series: "2012",
      license_key: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
    };

    expect(licenseKeys.create(payload)).toEqual({
      type: "CREATE_LICENSE_KEY",
      payload
    });
  });

  it("can fetch license keys", () => {
    expect(licenseKeys.fetch()).toEqual({
      type: "FETCH_LICENSE_KEYS"
    });
  });

  it("can delete license keys", () => {
    const payload = { osystem: "windows", distro_series: "2012" };
    expect(licenseKeys.delete(payload)).toEqual({
      type: "DELETE_LICENSE_KEY",
      payload
    });
  });

  it("can update license keys", () => {
    const payload = { osystem: "windows", distro_series: "2012" };
    expect(licenseKeys.update(payload)).toEqual({
      type: "UPDATE_LICENSE_KEY",
      payload
    });
  });

  it("can clean up license keys", () => {
    expect(licenseKeys.cleanup()).toEqual({
      type: "CLEANUP_LICENSE_KEYS"
    });
  });
});

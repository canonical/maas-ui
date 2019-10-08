import licenseKeys from "./licensekeys";

describe("licenseKeys actions", () => {
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

  it("can clean up license keys", () => {
    expect(licenseKeys.cleanup()).toEqual({
      type: "CLEANUP_LICENSE_KEYS"
    });
  });
});

import licenseKeys from "./licensekeys";

describe("licenseKeys actions", () => {
  it("should handle fetching license keys", () => {
    expect(licenseKeys.fetch()).toEqual({
      type: "FETCH_LICENSE_KEYS"
    });
  });

  it("can handle cleaning up license keys", () => {
    expect(licenseKeys.cleanup()).toEqual({
      type: "CLEANUP_LICENSE_KEYS"
    });
  });
});

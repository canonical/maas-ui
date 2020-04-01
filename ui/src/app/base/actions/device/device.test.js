import device from "./device";

describe("device actions", () => {
  it("should handle fetching devices", () => {
    expect(device.fetch()).toEqual({
      type: "FETCH_DEVICE",
      meta: {
        model: "device",
        method: "list",
      },
    });
  });
});

import status from "./status";

describe("status", () => {
  it("can get the connected status", () => {
    const state = {
      status: {
        connected: false
      }
    };
    expect(status.connected(state)).toBe(false);
  });

  it("can get the error status", () => {
    const state = {
      status: {
        error: false
      }
    };
    expect(status.error(state)).toBe(false);
  });
});

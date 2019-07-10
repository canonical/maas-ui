import selectors from "./selectors";

describe("status", () => {
  it("can get the connected status", () => {
    const state = {
      status: {
        connected: false
      }
    };
    expect(selectors.status.getConnected(state)).toBe(false);
  });

  it("can get the error status", () => {
    const state = {
      status: {
        error: false
      }
    };
    expect(selectors.status.getError(state)).toBe(false);
  });
});

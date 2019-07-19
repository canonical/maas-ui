import selectors from "./selectors";

describe("base selectors", () => {
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
  describe("auth", () => {
    it("can get the current user details", () => {
      const state = {
        auth: {
          loading: true
        }
      };
      expect(selectors.auth.getAuthUser(state)).toStrictEqual({
        loading: true
      });
    });
  });
});

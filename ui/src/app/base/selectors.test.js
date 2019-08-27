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
        user: {
          auth: {
            user: { username: "admin" },
            loading: true
          }
        }
      };
      expect(selectors.auth.getAuthUser(state)).toStrictEqual({
        username: "admin"
      });
    });

    it("can get the current user loading status", () => {
      const state = {
        user: {
          auth: {
            user: { username: "admin" },
            loading: true
          }
        }
      };
      expect(selectors.auth.getAuthUserLoading(state)).toStrictEqual(true);
    });
  });

  describe("messages", () => {
    it("can get all messages", () => {
      const state = {
        messages: {
          items: [
            {
              id: 1,
              message: "User added"
            }
          ]
        }
      };
      expect(selectors.messages.all(state)).toStrictEqual([
        {
          id: 1,
          message: "User added"
        }
      ]);
    });
  });
});

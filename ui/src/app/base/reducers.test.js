import reducers from "./reducers";

describe("base reducers", () => {
  describe("status", () => {
    it("should return the initial state", () => {
      expect(reducers.status(undefined, {})).toStrictEqual({
        connected: false,
        error: null
      });
    });

    it("should correctly reduce WEBSOCKET_CONNECT", () => {
      expect(
        reducers.status(
          {
            connected: true,
            error: null
          },
          {
            type: "WEBSOCKET_CONNECT"
          }
        )
      ).toStrictEqual({
        connected: false,
        error: null
      });
    });

    it("should correctly reduce WEBSOCKET_CONNECTED", () => {
      expect(
        reducers.status(undefined, {
          type: "WEBSOCKET_CONNECTED"
        })
      ).toStrictEqual({
        connected: true,
        error: null
      });
    });

    it("should correctly reduce WEBSOCKET_ERROR", () => {
      expect(
        reducers.status(undefined, {
          type: "WEBSOCKET_ERROR",
          error: "Error!"
        })
      ).toStrictEqual({
        connected: false,
        error: "Error!"
      });
    });
  });

  describe("auth", () => {
    it("should return the initial state", () => {
      expect(reducers.auth(undefined, {})).toStrictEqual({
        loading: false,
        user: null
      });
    });

    it("should correctly reduce FETCH_AUTH_USER_START", () => {
      expect(
        reducers.auth(
          {
            loading: false,
            user: null
          },
          {
            type: "FETCH_AUTH_USER_START"
          }
        )
      ).toStrictEqual({
        loading: true,
        user: null
      });
    });

    it("should correctly reduce FETCH_AUTH_USER_SUCCESS", () => {
      expect(
        reducers.auth(
          {
            loading: true,
            user: null
          },
          {
            payload: { username: "admin" },
            type: "FETCH_AUTH_USER_SUCCESS"
          }
        )
      ).toStrictEqual({
        loading: false,
        user: { username: "admin" }
      });
    });
  });
});

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
            auth: {
              loading: false,
              user: null
            }
          },
          {
            type: "FETCH_AUTH_USER_START"
          }
        )
      ).toStrictEqual({
        auth: {
          loading: true,
          user: null
        }
      });
    });

    it("should correctly reduce FETCH_AUTH_USER_SUCCESS", () => {
      expect(
        reducers.auth(
          {
            auth: {
              loading: true,
              user: null
            }
          },
          {
            payload: { username: "admin" },
            type: "FETCH_AUTH_USER_SUCCESS"
          }
        )
      ).toStrictEqual({
        auth: {
          loading: false,
          user: { username: "admin" }
        }
      });
    });
  });

  describe("messages", () => {
    it("should return the initial state", () => {
      expect(reducers.messages(undefined, {})).toStrictEqual({
        items: []
      });
    });

    it("should correctly reduce ADD_MESSAGE", () => {
      expect(
        reducers.messages(undefined, {
          type: "ADD_MESSAGE",
          payload: {
            message: "User added"
          }
        })
      ).toStrictEqual({
        items: [
          {
            message: "User added"
          }
        ]
      });
    });

    it("should correctly reduce REMOVE_MESSAGE", () => {
      expect(
        reducers.messages(
          {
            items: [
              {
                id: 99,
                message: "User added"
              },
              {
                id: 100,
                message: "User updated"
              }
            ]
          },
          {
            type: "REMOVE_MESSAGE",
            payload: 99
          }
        )
      ).toStrictEqual({
        items: [
          {
            id: 100,
            message: "User updated"
          }
        ]
      });
    });
  });
});

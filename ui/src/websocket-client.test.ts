import WebSocketClient, { WebSocketMessageType } from "./websocket-client";

import { getCookie } from "app/utils";

jest.mock("app/utils");

const testAction = {
  meta: { model: "test", method: "test" },
  payload: {
    params: {},
  },
  type: "TEST_ACTION",
};

describe("websocket client", () => {
  let client: WebSocketClient;
  const getCookieMock = getCookie as jest.Mock;

  beforeEach(() => {
    getCookieMock.mockImplementation(() => "abc123");
    client = new WebSocketClient();
    client.connect();
    if (client.socket) {
      jest.spyOn(client.socket, "send");
    }
  });

  afterEach(() => {
    getCookieMock.mockReset();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("throws an error if the csrftoken does not exist", () => {
    getCookieMock.mockImplementation(() => null);
    const client2 = new WebSocketClient();
    expect(client2.connect).toThrow();
  });

  it("can send a message", () => {
    client.send(testAction, {
      type: WebSocketMessageType.REQUEST,
      method: "packagerepository.list",
    });
    expect(
      JSON.parse((client.socket?.send as jest.Mock).mock.calls[0][0])
    ).toStrictEqual({
      method: "packagerepository.list",
      request_id: 0,
      type: WebSocketMessageType.REQUEST,
    });
  });

  it("increments the id", () => {
    expect(
      client.send(testAction, {
        type: WebSocketMessageType.REQUEST,
        method: "packagerepository.list",
      })
    ).toBe(0);
    expect(
      client.send(testAction, {
        type: WebSocketMessageType.REQUEST,
        method: "packagerepository.list",
      })
    ).toBe(1);
  });

  it("can get a stored request", () => {
    client.send(testAction, {
      type: WebSocketMessageType.REQUEST,
      method: "packagerepository.list",
    });
    expect(client.getRequest(0)).toStrictEqual(testAction);
  });
});

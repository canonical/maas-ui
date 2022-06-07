import type { PayloadAction } from "@reduxjs/toolkit";
import ReconnectingWebSocket from "reconnecting-websocket";

import type { AnyObject } from "app/base/types";
import { getCookie } from "app/utils";

// A model and method (e.g. 'users.list')
export type WebSocketEndpoint = string;

// Message types defined by MAAS websocket API.
export enum WebSocketMessageType {
  REQUEST = 0,
  RESPONSE = 1,
  NOTIFY = 2,
  PING = 3,
  PING_REPLY = 4,
}

export enum WebSocketResponseType {
  SUCCESS = 0,
  ERROR = 1,
}

type WebSocketMessage = {
  request_id: number;
};

export type WebSocketRequestMessage = {
  method: WebSocketEndpoint;
  type: WebSocketMessageType;
  params?: Record<string, unknown> | Record<string, unknown>[];
};

export type WebSocketRequest = WebSocketMessage & WebSocketRequestMessage;

export type WebSocketResponseResult<R = unknown> = WebSocketMessage & {
  result: R;
  rtype: WebSocketResponseType.SUCCESS;
  type: WebSocketMessageType;
};

export type WebSocketResponseError = WebSocketMessage & {
  // The error might be a message or JSON.
  error: string;
  rtype: WebSocketResponseType.ERROR;
  type: WebSocketMessageType.RESPONSE;
};

export type WebSocketResponseNotify = {
  action: string;
  // The data will be parsed from JSON.
  data: unknown;
  name: string;
  type: WebSocketMessageType.NOTIFY;
};

export type WebSocketActionParams = AnyObject | AnyObject[];

export type WebSocketAction<P = WebSocketActionParams> = PayloadAction<
  {
    params: P;
  },
  string,
  {
    // Whether the request should be fetched in batches.
    batch?: boolean;
    // Whether the request should only be fetched the first time.
    cache?: boolean;
    // Whether each item in the params should be dispatched separately. The
    // params need to be an array for this to work.
    dispatchMultiple?: boolean;
    // A key to be used to identify a file in the file context.
    fileContextKey?: string;
    // The endpoint method e.g. "list".
    method: string;
    // The endpoint model e.g. "machine".
    model: string;
    // Whether the request should be fetched every time.
    nocache?: boolean;
    // Whether the request should be polled.
    poll?: boolean;
    // An id for the polling request. This can be used to have multiple polling
    // events for the same endpoint.
    pollId?: string;
    // The amount of time in milliseconds between requests.
    pollInterval?: number;
    // Whether polling should be stopped for the request.
    pollStop?: boolean;
    // Batch requests may set a limit for all requests after the first (i.e. the
    // first action may set a limit of 5 and then use subsequentLimit to set all
    // following requests to 10).
    subsequentLimit?: number;
    // Whether the response should be stored in the file context.
    useFileContext?: boolean;
  }
>;

export class WebSocketClient {
  _nextId: WebSocketRequest["request_id"];
  _requests: Map<WebSocketRequest["request_id"], WebSocketAction>;
  socket: ReconnectingWebSocket | null;

  constructor() {
    this._nextId = 0;
    this._requests = new Map();
    this.socket = null;
  }

  /**
   * Dynamically build a websocket url from window.location
   * @param {string} csrftoken - A csrf token string.
   * @return {string} The built websocket url.
   */
  buildURL(): string {
    const csrftoken = getCookie("csrftoken");
    if (!csrftoken) {
      throw new Error(
        "No csrftoken found, please ensure you are logged into MAAS."
      );
    }
    const { hostname, port } = window.location;
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${hostname}:${port}${process.env.REACT_APP_BASENAME}/ws?csrftoken=${csrftoken}`;
  }

  /**
   * Get the next available request id.
   * @returns {Integer} An id.
   */
  _getId(): WebSocketRequest["request_id"] {
    const id = this._nextId;
    this._nextId++;
    return id;
  }

  /**
   * Store a mapping of id to action type.
   * @param {Object} action - A Redux action.
   * @returns {Integer} The id that was created.
   */
  _addRequest(action: WebSocketAction): WebSocketRequest["request_id"] {
    const id = this._getId();
    this._requests.set(id, action);
    return id;
  }

  /**
   * Create a reconnecting websocket and connect to it.
   * @returns {Object} The websocket that was created.
   */
  connect(): ReconnectingWebSocket {
    this.socket = new ReconnectingWebSocket(this.buildURL());
    return this.socket;
  }

  /**
   * Get a base action type from a given id.
   * @param {Integer} id - A request id.
   * @returns {Object} A Redux action.
   */
  getRequest(id: WebSocketRequest["request_id"]): WebSocketAction | null {
    return this._requests.get(id) || null;
  }

  /**
   * Send a websocket message.
   * @param {String} action - A base Redux action type.
   * @param {Object} message - The message content.
   */
  send(
    action: WebSocketAction,
    message: WebSocketRequestMessage
  ): WebSocketRequest["request_id"] {
    const id = this._addRequest(action);
    const payload = {
      ...message,
      request_id: id,
    };
    if (this.socket) {
      this.socket.send(JSON.stringify(payload));
    }
    return id;
  }
}

export default WebSocketClient;

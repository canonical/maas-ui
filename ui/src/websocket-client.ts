import { BASENAME } from "@maas-ui/maas-ui-shared";
import ReconnectingWebSocket from "reconnecting-websocket";
import type { Action } from "redux";

import { getCookie } from "app/utils";

export type WebSocketRequestId = number;

// A model and method (e.g. 'users.list')
export type WebSocketEndpoint = string;

// Message types defined by MAAS websocket API.
export enum WebSocketMessageType {
  REQUEST = 0,
  RESPONSE = 1,
  NOTIFY = 2,
}

export type WebSocketMessage = {
  method: WebSocketEndpoint;
  type: WebSocketMessageType;
  params?: Record<string, unknown>;
};

class WebSocketClient {
  _nextId: WebSocketRequestId;
  _requests: Map<WebSocketRequestId, Action>;
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
    return `${protocol}//${hostname}:${port}${BASENAME}/ws?csrftoken=${csrftoken}`;
  }

  /**
   * Get the next available request id.
   * @returns {Integer} An id.
   */
  _getId(): WebSocketRequestId {
    const id = this._nextId;
    this._nextId++;
    return id;
  }

  /**
   * Store a mapping of id to action type.
   * @param {Object} action - A Redux action.
   * @returns {Integer} The id that was created.
   */
  _addRequest(action: Action): WebSocketRequestId {
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
  getRequest(id: WebSocketRequestId): Action | null {
    return this._requests.get(id) || null;
  }

  /**
   * Send a websocket message.
   * @param {String} action - A base Redux action type.
   * @param {Object} message - The message content.
   */
  send(action: Action, message: WebSocketMessage): WebSocketRequestId {
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

import { getCookie } from "app/utils";
import ReconnectingWebSocket from "reconnecting-websocket";

class WebSocketClient {
  constructor() {
    this._nextId = 0;
    this._requests = new Map();
  }

  /**
   * Dynamically build a websocket url from window.location
   * @param {string} csrftoken - A csrf token string.
   * @return {string} The built websocket url.
   */
  buildURL() {
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
  _getId() {
    const id = this._nextId;
    this._nextId++;
    return id;
  }

  /**
   * Store a mapping of id to action type.
   * @param {Object} action - A Redux action.
   * @returns {Integer} The id that was created.
   */
  _addRequest(action) {
    const id = this._getId();
    this._requests.set(id, action);
    return id;
  }

  /**
   * Create a reconnecting websocket and connect to it.
   * @returns {Object} The websocket that was created.
   */
  connect() {
    this.socket = new ReconnectingWebSocket(this.buildURL());
    return this.socket;
  }

  /**
   * Get a base action type from a given id.
   * @param {Integer} id - A request id.
   * @returns {Object} A Redux action.
   */
  getRequest(id) {
    return this._requests.get(id);
  }

  /**
   * Send a websocket message.
   * @param {String} action - A base Redux action type.
   * @param {Object} message - The message content.
   */
  send(action, message) {
    const id = this._addRequest(action);
    const payload = {
      ...message,
      request_id: id,
    };
    this.socket.send(JSON.stringify(payload));
    return id;
  }
}

export default WebSocketClient;

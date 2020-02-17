import { createAction } from "@reduxjs/toolkit";

const websocket = {};

websocket.connect = createAction("WEBSOCKET_CONNECT");

export default websocket;

const websocket = {};

websocket.connect = () => {
  return {
    type: "WEBSOCKET_CONNECT"
  };
};

export default websocket;

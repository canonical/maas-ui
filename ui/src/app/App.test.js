import { shallow } from "enzyme";
import React from "react";
import sinon from "sinon";

import { App } from "./App";

describe("App", () => {
  it("renders", () => {
    const wrapper = shallow(
      <App
        connected={true}
        connectionError={false}
        connectWebSocket={sinon.stub()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("displays connection errors", () => {
    const wrapper = shallow(
      <App
        connected={true}
        connectionError={true}
        connectWebSocket={sinon.stub()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("displays a loading message", () => {
    const wrapper = shallow(
      <App
        connected={false}
        connectionError={false}
        connectWebSocket={sinon.stub()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("connects to the WebSocket", () => {
    const connectWebSocket = sinon.stub();
    shallow(
      <App
        connected={false}
        connectionError={false}
        connectWebSocket={connectWebSocket}
      />
    );
    expect(connectWebSocket.callCount).toBe(1);
  });
});

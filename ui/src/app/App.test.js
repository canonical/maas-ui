import { shallow } from "enzyme";
import React from "react";

import { App } from "./App";

describe("App", () => {
  it("renders", () => {
    const wrapper = shallow(
      <App
        connected={true}
        connectionError={false}
        connectWebSocket={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("displays connection errors", () => {
    const wrapper = shallow(
      <App
        connected={true}
        connectionError={true}
        connectWebSocket={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("displays a loading message", () => {
    const wrapper = shallow(
      <App
        connected={false}
        connectionError={false}
        connectWebSocket={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("connects to the WebSocket", () => {
    const connectWebSocket = jest.fn();
    shallow(
      <App
        connected={false}
        connectionError={false}
        connectWebSocket={connectWebSocket}
      />
    );
    expect(connectWebSocket.mock.calls.length).toBe(1);
  });
});

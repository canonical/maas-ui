import { mount, shallow } from "enzyme";
import React from "react";

import { App } from "./App";
import Main from "app/base/components/Main";

describe("App", () => {
  it("renders", () => {
    const wrapper = shallow(
      <App
        connected={true}
        connectionError={null}
        connectWebSocket={jest.fn()}
      />
    );
    expect(wrapper.type()).toBe(Main);
  });

  it("displays connection errors", () => {
    const wrapper = shallow(
      <App
        connected={true}
        connectionError={{ error: "Error!" }}
        connectWebSocket={jest.fn()}
      />
    );
    expect(wrapper.prop("title")).toBe(
      "Failed to connect. Please try refreshing your browser."
    );
  });

  it("displays a loading message", () => {
    const wrapper = shallow(
      <App
        connected={false}
        connectionError={null}
        connectWebSocket={jest.fn()}
      />
    );
    expect(wrapper.prop("title")).toBe("Loading…");
  });

  it("connects to the WebSocket", () => {
    const connectWebSocket = jest.fn();
    mount(
      <App
        connected={false}
        connectionError={null}
        connectWebSocket={connectWebSocket}
      />
    );
    expect(connectWebSocket.mock.calls.length).toBe(1);
  });
});

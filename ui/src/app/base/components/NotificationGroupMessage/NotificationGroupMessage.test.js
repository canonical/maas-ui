import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import NotificationGroupMessage from "./NotificationGroupMessage";

const mockStore = configureStore();

describe("NotificationGroupMessage", () => {
  let state;
  beforeEach(() => {
    state = {};
  });

  it("renders a message", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroupMessage message="Hello there" />
      </Provider>
    );

    expect(wrapper.find("NotificationGroupMessage").text()).toContain(
      "Hello there"
    );
  });

  it("optionally renders an action", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroupMessage message="A message" action="delete" />
      </Provider>
    );
    expect(wrapper.find("NotificationGroupMessage").text()).toContain("delete");
  });

  it("can call a callback", () => {
    const callback = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NotificationGroupMessage
          message="A message"
          action="delete"
          id={1}
          actionHandler={callback}
        />
      </Provider>
    );

    wrapper.find("button[data-test='action-link']").simulate("click");

    expect(callback).toHaveBeenCalledWith(1, expect.anything());
  });
});

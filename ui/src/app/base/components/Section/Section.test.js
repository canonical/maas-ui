import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import Section from "./Section";

const mockStore = configureStore();

describe("Section", () => {
  let state;

  beforeEach(() => {
    state = {
      messages: { items: [{ id: 1, message: "User deleted" }] }
    };
  });

  it("renders", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Section title="Settings" sidebar={<div>Sidebar</div>}>
          content
        </Section>
      </Provider>
    );
    expect(wrapper.find("Section")).toMatchSnapshot();
  });

  it("renders without a sidebar", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Section title="Settings">content</Section>
      </Provider>
    );
    expect(wrapper.find(".section__sidebar").length).toEqual(0);
    expect(
      wrapper
        .find(".section__content")
        .at(0)
        .prop("className")
        .includes("col-10")
    ).toBe(false);
  });

  it("can display a notification", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Section title="Settings">content</Section>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toEqual(true);
  });

  it("can hide a notification", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Section title="Settings">content</Section>
      </Provider>
    );
    wrapper
      .find("Notification")
      .props()
      .close();
    expect(store.getActions()).toEqual([
      {
        type: "REMOVE_MESSAGE",
        payload: 1
      }
    ]);
  });
});

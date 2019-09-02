import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import Scripts from ".";

const mockStore = configureStore();

describe("Scripts", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      scripts: {
        loading: false,
        loaded: true,
        items: [
          {
            name: "commissioning script",
            description: "a commissioning script",
            type: 0
          },
          {
            name: "testing script",
            description: "a testing script",
            type: 2
          },
          {
            name: "testing script two",
            description: "another testing script",
            type: 2
          }
        ]
      }
    };
  });

  it("dispatches action to fetch scripts load", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <Scripts />
      </Provider>
    );

    expect(store.getActions()).toEqual([
      {
        type: "FETCH_SCRIPTS"
      }
    ]);
  });

  it("Displays commissioning scripts by default", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <Scripts />
      </Provider>
    );

    expect(wrapper.find("ul").children().length).toEqual(1);
    expect(
      wrapper
        .find("ul")
        .children()
        .first()
        .text()
    ).toEqual("commissioning script - a commissioning script");
  });

  it("Displays testing scripts", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <Scripts type="testing" />
      </Provider>
    );

    expect(wrapper.find("ul").children().length).toEqual(2);
    expect(
      wrapper
        .find("ul")
        .children()
        .first()
        .text()
    ).toEqual("testing script - a testing script");
    expect(
      wrapper
        .find("ul")
        .children()
        .at(1)
        .text()
    ).toEqual("testing script two - another testing script");
  });
});

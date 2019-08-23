import { shallow, mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ThirdPartyDriversForm from "./ThirdPartyDriversForm";

const mockStore = configureStore();

describe("ThirdPartyDriversForm", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        loading: false,
        loaded: true,
        items: [
          {
            name: "enable_third_party_drivers",
            value: true
          }
        ]
      }
    };
  });

  it("can render", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = shallow(
      <Provider store={store}>
        <ThirdPartyDriversForm />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("sets enable_third_party_drivers value", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <ThirdPartyDriversForm />
      </Provider>
    );
    expect(
      wrapper
        .find("[name='enable_third_party_drivers']")
        .first()
        .props().value
    ).toBe(true);
  });
});

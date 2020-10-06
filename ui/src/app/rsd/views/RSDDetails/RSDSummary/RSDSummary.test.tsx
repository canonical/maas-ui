import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import RSDSummary from "./RSDSummary";

const mockStore = configureStore();

describe("RSDSummary", () => {
  it("can display the power address", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            id: 1,
            power_address: "127.0.0.1",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd/1", key: "testKey" }]}>
          <Route exact path="/rsd/:id" component={() => <RSDSummary />} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Code").exists()).toBe(true);
    expect(wrapper.find("Code input").prop("value")).toBe("127.0.0.1");
  });
});

import React from "react";

import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import RSDActionFormWrapper from "./RSDActionFormWrapper";

import {
  pod as podFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("RSDActionFormWrapper", () => {
  let initialState = rootStateFactory();

  beforeEach(() => {
    initialState = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({ id: 1, name: "pod-1", type: "rsd" }),
          podFactory({ id: 2, name: "pod-2", type: "rsd" }),
        ],
        statuses: {
          1: podStatusFactory(),
          2: podStatusFactory(),
        },
      }),
    });
  });

  it("renders DeleteForm if delete action selected", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd", key: "testKey" }]}>
          <RSDActionFormWrapper
            selectedAction="delete"
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("DeleteForm").exists()).toBe(true);
  });

  it("renders RefreshForm if refresh action selected", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd", key: "testKey" }]}>
          <RSDActionFormWrapper
            selectedAction="refresh"
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("RefreshForm").exists()).toBe(true);
  });
});

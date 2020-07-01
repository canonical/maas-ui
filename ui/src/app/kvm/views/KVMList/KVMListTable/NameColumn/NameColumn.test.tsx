import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import React from "react";

import NameColumn from "./NameColumn";

const mockStore = configureStore();

describe("NameColumn", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      pod: {
        items: [
          {
            id: 1,
            name: "pod-1",
          },
        ],
        selected: [],
      },
    };
  });

  it("can display a link to details page", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <NameColumn handleCheckbox={jest.fn()} id={1} selected={false} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Link").text()).toBe("pod-1");
    expect(wrapper.find("Link").props().to).toBe("/kvm/1");
  });

  it("sets checkbox to checked if pod is selected", () => {
    const state = { ...initialState };
    state.pod.selected = [1];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <NameColumn handleCheckbox={jest.fn()} id={1} selected />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Input").prop("checked")).toBe(true);
  });
});

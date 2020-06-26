import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import RefreshForm from "./RefreshForm";

const mockStore = configureStore();

describe("RefreshForm", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      pod: {
        items: [
          { id: 1, name: "pod-1", type: "lxd" },
          { id: 2, name: "pod-2", type: "virsh" },
        ],
        selected: [],
        errors: {},
      },
    };
  });

  it("correctly dispatches actions to refresh selected KVMs", () => {
    const state = { ...initialState };
    state.pod.selected = [1, 2];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <RefreshForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").prop("onSubmit")());
    expect(
      store.getActions().filter((action) => action.type === "REFRESH_POD")
    ).toStrictEqual([
      {
        type: "REFRESH_POD",
        meta: {
          model: "pod",
          method: "refresh",
        },
        payload: {
          params: {
            id: state.pod.items[0].id,
          },
        },
      },
      {
        type: "REFRESH_POD",
        meta: {
          model: "pod",
          method: "refresh",
        },
        payload: {
          params: {
            id: state.pod.items[1].id,
          },
        },
      },
    ]);
  });
});

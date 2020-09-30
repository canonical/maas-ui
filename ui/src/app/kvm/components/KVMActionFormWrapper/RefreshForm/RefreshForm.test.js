import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import RefreshForm from "./RefreshForm";
import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("RefreshForm", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({ id: 1, name: "pod-1", type: "lxd" }),
          podFactory({ id: 2, name: "pod-2", type: "virsh" }),
        ],
        statuses: {
          1: {
            deleting: false,
            refreshing: false,
          },
          2: {
            deleting: false,
            refreshing: false,
          },
        },
      }),
    });
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
      store.getActions().filter((action) => action.type === "pod/refresh")
    ).toStrictEqual([
      {
        type: "pod/refresh",
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
        type: "pod/refresh",
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

  it("can show the processing status when refreshing KVMs", () => {
    const state = { ...initialState };
    state.pod.selected = [1, 2];
    state.pod.statuses["1"] = { refreshing: true };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <RefreshForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    act(() => wrapper.find("Formik").prop("onSubmit")());
    wrapper.update();
    expect(wrapper.find("FormikForm").prop("saving")).toBe(true);
    expect(wrapper.find('[data-test="loading-label"]').text()).toBe(
      "Refreshing 1 of 2 KVMs..."
    );
  });
});

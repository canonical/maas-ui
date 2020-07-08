import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import DeleteForm from "./DeleteForm";

const mockStore = configureStore();

describe("DeleteForm", () => {
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
      },
    };
  });

  it("correctly dispatches actions to delete selected KVMs", () => {
    const state = { ...initialState };
    state.pod.selected = [1, 2];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <DeleteForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    act(() => wrapper.find("Formik").prop("onSubmit")());
    expect(
      store.getActions().filter((action) => action.type === "DELETE_POD")
    ).toStrictEqual([
      {
        type: "DELETE_POD",
        meta: {
          model: "pod",
          method: "delete",
        },
        payload: {
          params: {
            id: state.pod.items[0].id,
          },
        },
      },
      {
        type: "DELETE_POD",
        meta: {
          model: "pod",
          method: "delete",
        },
        payload: {
          params: {
            id: state.pod.items[1].id,
          },
        },
      },
    ]);
  });

  it("can show the processing status when deleting KVMs", () => {
    const state = { ...initialState };
    state.pod.selected = [1, 2];
    state.pod.statuses["1"].deleting = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <DeleteForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    act(() => wrapper.find("Formik").prop("onSubmit")());
    wrapper.update();
    expect(wrapper.find("FormikForm").prop("saving")).toBe(true);
    expect(wrapper.find('[data-test="loading-label"]').text()).toBe(
      "Deleting 1 of 2 KVMs..."
    );
  });
});

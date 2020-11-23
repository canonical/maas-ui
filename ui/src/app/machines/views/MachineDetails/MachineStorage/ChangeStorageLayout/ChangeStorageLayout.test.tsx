import React from "react";

import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ChangeStorageLayout from "./ChangeStorageLayout";

import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ChangeStorageLayout", () => {
  it("shows a confirmation form if a storage layout is selected", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <ChangeStorageLayout id="abc123" />
      </Provider>
    );

    // Open storage layout dropdown
    act(() => {
      wrapper.find("ContextualMenu Button").simulate("click");
    });
    wrapper.update();
    // Select flat storage layout
    act(() => {
      wrapper.find("ContextualMenuDropdown Button").at(0).simulate("click");
    });
    wrapper.update();

    expect(wrapper.find("[data-test='confirmation-form']").exists()).toBe(true);
  });

  it("correctly dispatches an action to update a machine's storage layout", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <ChangeStorageLayout id="abc123" />
      </Provider>
    );

    // Open storage layout dropdown
    act(() => {
      wrapper.find("ContextualMenu Button").simulate("click");
    });
    wrapper.update();
    // Select flat storage layout
    act(() => {
      wrapper.find("ContextualMenuDropdown Button").at(0).simulate("click");
    });
    wrapper.update();
    // Submit the form
    act(() => {
      wrapper.find("Formik").prop("onSubmit")();
    });

    expect(
      store
        .getActions()
        .find((action) => action.type === "machine/applyStorageLayout")
    ).toStrictEqual({
      meta: {
        method: "apply_storage_layout",
        model: "machine",
      },
      payload: {
        params: {
          storage_layout: "flat",
          system_id: "abc123",
        },
      },
      type: "machine/applyStorageLayout",
    });
  });
});

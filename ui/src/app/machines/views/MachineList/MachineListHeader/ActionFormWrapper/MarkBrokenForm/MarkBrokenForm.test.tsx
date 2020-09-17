import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import MarkBrokenForm from "./MarkBrokenForm";
import { RootState } from "app/store/root/types";
import {
  generalState as generalStateFactory,
  rootState as rootStateFactory,
  machine as machineFactory,
  machineActionsState as machineActionsStateFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MarkBrokenForm", () => {
  let initialState: RootState;
  beforeEach(() => {
    initialState = rootStateFactory({
      general: generalStateFactory({
        machineActions: machineActionsStateFactory({
          data: [
            {
              name: "mark-broken",
              title: "Mark broken",
              sentence: "marked broken",
              type: "testing",
            },
          ],
        }),
      }),
      machine: machineStateFactory({
        items: [
          machineFactory({ system_id: "abc123" }),
          machineFactory({ system_id: "def456" }),
        ],
        statuses: {
          abc123: machineStatusFactory({ markingBroken: false }),
          def456: machineStatusFactory({ markingBroken: false }),
        },
      }),
    });
  });

  it("dispatches actions to mark selected machines broken", () => {
    const store = mockStore(initialState);
    initialState.machine.selected = ["abc123", "def456"];
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MarkBrokenForm setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper.find("Formik").props().onSubmit({
        comment: "machine is on fire",
      })
    );

    expect(store.getActions()).toStrictEqual([
      {
        type: "MARK_MACHINE_BROKEN",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "mark-broken",
            extra: {
              message: "machine is on fire",
            },
            system_id: "abc123",
          },
        },
      },
      {
        type: "MARK_MACHINE_BROKEN",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "mark-broken",
            extra: {
              message: "machine is on fire",
            },
            system_id: "def456",
          },
        },
      },
    ]);
  });
});

import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import MarkBrokenForm from "./MarkBrokenForm";

import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  generalState as generalStateFactory,
  rootState as rootStateFactory,
  machine as machineFactory,
  machineAction as machineActionFactory,
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
            machineActionFactory({
              name: NodeActions.MARK_BROKEN,
              title: "Mark broken",
              sentence: "marked broken",
              type: "testing",
            }),
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
        type: "machine/markBroken",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.MARK_BROKEN,
            extra: {
              message: "machine is on fire",
            },
            system_id: "abc123",
          },
        },
      },
      {
        type: "machine/markBroken",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.MARK_BROKEN,
            extra: {
              message: "machine is on fire",
            },
            system_id: "def456",
          },
        },
      },
    ]);
  });

  it("dispatches actions to mark selected machines broken without a message", () => {
    const store = mockStore(initialState);
    initialState.machine.selected = ["abc123"];
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
        comment: "",
      })
    );

    expect(store.getActions()).toStrictEqual([
      {
        type: "machine/markBroken",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.MARK_BROKEN,
            extra: {
              message: "",
            },
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("correctly dispatches action to mark machine broken from details view", () => {
    const state = { ...initialState };
    state.machine.active = "abc123";
    state.machine.selected = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => <MarkBrokenForm setSelectedAction={jest.fn()} />}
          />
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
        type: "machine/markBroken",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.MARK_BROKEN,
            extra: {
              message: "machine is on fire",
            },
            system_id: "abc123",
          },
        },
      },
    ]);
  });
});

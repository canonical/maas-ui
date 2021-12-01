import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import MarkBrokenForm from "./MarkBrokenForm";

import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  rootState as rootStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("MarkBrokenForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
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

  it("dispatches actions to mark given machines broken", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MarkBrokenForm
            clearHeaderContent={jest.fn()}
            machines={state.machine.items}
            processingCount={0}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      submitFormikForm(wrapper, {
        comment: "machine is on fire",
      })
    );

    expect(
      store
        .getActions()
        .filter((action) => action.type === "machine/markBroken")
    ).toStrictEqual([
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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <MarkBrokenForm
            clearHeaderContent={jest.fn()}
            machines={[state.machine.items[0]]}
            processingCount={0}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      submitFormikForm(wrapper, {
        comment: "",
      })
    );

    expect(
      store.getActions().find((action) => action.type === "machine/markBroken")
    ).toStrictEqual({
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
    });
  });
});

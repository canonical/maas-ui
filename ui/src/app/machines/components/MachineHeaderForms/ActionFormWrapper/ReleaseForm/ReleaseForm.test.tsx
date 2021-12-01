import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ReleaseForm from "./ReleaseForm";

import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("ReleaseForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        loaded: true,
        items: [
          configFactory({
            name: "enable_disk_erasing_on_release",
            value: false,
          }),
          configFactory({ name: "disk_erase_with_secure_erase", value: false }),
          configFactory({ name: "disk_erase_with_quick_erase", value: false }),
        ],
      }),
      machine: machineStateFactory({
        items: [
          machineFactory({ system_id: "abc123" }),
          machineFactory({ system_id: "def456" }),
        ],
        statuses: {
          abc123: machineStatusFactory({ releasing: false }),
          def456: machineStatusFactory({ releasing: false }),
        },
      }),
    });
  });

  it("sets the initial disk erase behaviour from global config", () => {
    const store = mockStore(state);
    state.machine.selected = ["abc123", "def456"];
    state.config.items = [
      configFactory({ name: "enable_disk_erasing_on_release", value: true }),
      configFactory({ name: "disk_erase_with_secure_erase", value: false }),
      configFactory({ name: "disk_erase_with_quick_erase", value: true }),
    ];
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ReleaseForm
            clearHeaderContent={jest.fn()}
            machines={[]}
            processingCount={0}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("input[name='enableErase']").prop("value")).toBe(true);
    expect(wrapper.find("input[name='secureErase']").prop("value")).toBe(false);
    expect(wrapper.find("input[name='quickErase']").prop("value")).toBe(true);
  });

  it("correctly dispatches action to release given machines", () => {
    const store = mockStore(state);
    state.machine.selected = ["abc123", "def456"];
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ReleaseForm
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
        enableErase: true,
        quickErase: false,
        secureErase: true,
      })
    );

    expect(
      store.getActions().filter((action) => action.type === "machine/release")
    ).toStrictEqual([
      {
        type: "machine/release",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.RELEASE,
            extra: {
              erase: true,
              quick_erase: false,
              secure_erase: true,
            },
            system_id: "abc123",
          },
        },
      },
      {
        type: "machine/release",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.RELEASE,
            extra: {
              erase: true,
              quick_erase: false,
              secure_erase: true,
            },
            system_id: "def456",
          },
        },
      },
    ]);
  });
});

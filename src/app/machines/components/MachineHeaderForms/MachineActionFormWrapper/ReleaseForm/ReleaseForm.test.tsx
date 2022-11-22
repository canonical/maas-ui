import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import ReleaseForm from "./ReleaseForm";

import { ConfigNames } from "app/store/config/types";
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
            name: ConfigNames.ENABLE_DISK_ERASING_ON_RELEASE,
            value: false,
          }),
          configFactory({
            name: ConfigNames.DISK_ERASE_WITH_SECURE_ERASE,
            value: false,
          }),
          configFactory({
            name: ConfigNames.DISK_ERASE_WITH_QUICK_ERASE,
            value: false,
          }),
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
    state.machine.selectedMachines = { items: ["abc123", "def456"] };
    state.config.items = [
      configFactory({
        name: ConfigNames.ENABLE_DISK_ERASING_ON_RELEASE,
        value: true,
      }),
      configFactory({
        name: ConfigNames.DISK_ERASE_WITH_SECURE_ERASE,
        value: false,
      }),
      configFactory({
        name: ConfigNames.DISK_ERASE_WITH_QUICK_ERASE,
        value: true,
      }),
    ];
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <ReleaseForm
              clearHeaderContent={jest.fn()}
              machines={[]}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("input[name='enableErase']").prop("value")).toBe(true);
    expect(wrapper.find("input[name='secureErase']").prop("value")).toBe(false);
    expect(wrapper.find("input[name='quickErase']").prop("value")).toBe(true);
  });

  it("correctly dispatches action to release given machines", () => {
    const store = mockStore(state);
    state.machine.selectedMachines = { items: ["abc123", "def456"] };
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <ReleaseForm
              clearHeaderContent={jest.fn()}
              machines={state.machine.items}
              processingCount={0}
              viewingDetails={false}
            />
          </CompatRouter>
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

import { Provider } from "react-redux";
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
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

const mockStore = configureStore<RootState>();

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
    state.machine.selected = { items: ["abc123", "def456"] };
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
    renderWithBrowserRouter(
      <ReleaseForm
        clearSidePanelContent={jest.fn()}
        machines={[]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", state }
    );

    expect(
      screen.getByRole("checkbox", { name: "Erase disks before releasing" })
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Use secure erase" })
    ).not.toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Use quick erase (not secure)" })
    ).toBeChecked();
  });

  it("correctly dispatches action to release given machines", async () => {
    const store = mockStore(state);
    state.machine.selected = { items: ["abc123", "def456"] };
    renderWithBrowserRouter(
      <Provider store={store}>
        <ReleaseForm
          clearSidePanelContent={jest.fn()}
          machines={state.machine.items}
          processingCount={0}
          viewingDetails={false}
        />
      </Provider>,
      { route: "/machines", store }
    );

    await userEvent.click(
      screen.getByRole("checkbox", { name: "Erase disks before releasing" })
    );
    await userEvent.click(
      screen.getByRole("checkbox", { name: "Use secure erase" })
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Release 2 machines" })
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

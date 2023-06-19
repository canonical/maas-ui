import configureStore from "redux-mock-store";

import FieldlessForm from "./FieldlessForm";

import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, renderWithBrowserRouter, userEvent } from "testing/utils";

jest.mock("@canonical/react-components/dist/hooks", () => ({
  usePrevious: jest.fn(),
}));

const mockStore = configureStore<RootState>();

describe("FieldlessForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({
            system_id: "abc123",
          }),
        ],
        selected: null,
        statuses: {
          abc123: machineStatusFactory(),
        },
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("can unset the selected action", async () => {
    const store = mockStore(state);
    const clearSidePanelContent = jest.fn();
    renderWithBrowserRouter(
      <FieldlessForm
        action={NodeActions.ON}
        actions={machineActions}
        cleanup={machineActions.cleanup}
        clearSidePanelContent={clearSidePanelContent}
        modelName="machine"
        nodes={[state.machine.items[0]]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(clearSidePanelContent).toHaveBeenCalled();
  });

  it("can dispatch abort action on given machines", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <FieldlessForm
        action={NodeActions.ABORT}
        actions={machineActions}
        cleanup={machineActions.cleanup}
        clearSidePanelContent={jest.fn()}
        modelName="machine"
        nodes={[state.machine.items[0]]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Abort actions for machine" })
    );
    expect(
      store.getActions().filter(({ type }) => type === "machine/abort")
    ).toStrictEqual([
      {
        type: "machine/abort",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.ABORT,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch acquire action on given machines", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <FieldlessForm
        action={NodeActions.ACQUIRE}
        actions={machineActions}
        cleanup={machineActions.cleanup}
        clearSidePanelContent={jest.fn()}
        modelName="machine"
        nodes={[state.machine.items[0]]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Allocate machine" })
    );
    expect(
      store.getActions().filter(({ type }) => type === "machine/acquire")
    ).toStrictEqual([
      {
        type: "machine/acquire",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.ACQUIRE,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch exit rescue mode action on given machines", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <FieldlessForm
        action={NodeActions.EXIT_RESCUE_MODE}
        actions={machineActions}
        cleanup={machineActions.cleanup}
        clearSidePanelContent={jest.fn()}
        modelName="machine"
        nodes={[state.machine.items[0]]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Exit rescue mode for machine" })
    );
    expect(
      store.getActions().filter(({ type }) => type === "machine/exitRescueMode")
    ).toStrictEqual([
      {
        type: "machine/exitRescueMode",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.EXIT_RESCUE_MODE,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch lock action on given machines", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <FieldlessForm
        action={NodeActions.LOCK}
        actions={machineActions}
        cleanup={machineActions.cleanup}
        clearSidePanelContent={jest.fn()}
        modelName="machine"
        nodes={[state.machine.items[0]]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    await userEvent.click(screen.getByRole("button", { name: "Lock machine" }));
    expect(
      store.getActions().filter(({ type }) => type === "machine/lock")
    ).toStrictEqual([
      {
        type: "machine/lock",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.LOCK,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch mark fixed action on given machines", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <FieldlessForm
        action={NodeActions.MARK_FIXED}
        actions={machineActions}
        cleanup={machineActions.cleanup}
        clearSidePanelContent={jest.fn()}
        modelName="machine"
        nodes={[state.machine.items[0]]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Mark machine fixed" })
    );
    expect(
      store.getActions().filter(({ type }) => type === "machine/markFixed")
    ).toStrictEqual([
      {
        type: "machine/markFixed",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.MARK_FIXED,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch power off action on given machines", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <FieldlessForm
        action={NodeActions.OFF}
        actions={machineActions}
        cleanup={machineActions.cleanup}
        clearSidePanelContent={jest.fn()}
        modelName="machine"
        nodes={[state.machine.items[0]]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machine", store }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Power off machine" })
    );
    expect(
      store.getActions().filter(({ type }) => type === "machine/off")
    ).toStrictEqual([
      {
        type: "machine/off",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.OFF,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch power on action on given machines", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <FieldlessForm
        action={NodeActions.ON}
        actions={machineActions}
        cleanup={machineActions.cleanup}
        clearSidePanelContent={jest.fn()}
        modelName="machine"
        nodes={[state.machine.items[0]]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Power on machine" })
    );
    expect(
      store.getActions().filter(({ type }) => type === "machine/on")
    ).toStrictEqual([
      {
        type: "machine/on",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.ON,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });

  it("can dispatch unlock action on given machines", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <FieldlessForm
        action={NodeActions.UNLOCK}
        actions={machineActions}
        cleanup={machineActions.cleanup}
        clearSidePanelContent={jest.fn()}
        modelName="machine"
        nodes={[state.machine.items[0]]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Unlock machine" })
    );
    expect(
      store.getActions().filter(({ type }) => type === "machine/unlock")
    ).toStrictEqual([
      {
        type: "machine/unlock",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.UNLOCK,
            extra: {},
            system_id: "abc123",
          },
        },
      },
    ]);
  });
});

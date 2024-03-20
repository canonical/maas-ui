import configureStore from "redux-mock-store";

import PowerOffForm from "./PowerOffForm";

import { actions as machineActions } from "@/app/store/machine";
import type { RootState } from "@/app/store/root/types";
import { NodeActions } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("PowerOffForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      machine: factory.machineState({
        loaded: true,
        items: [
          factory.machine({
            system_id: "abc123",
          }),
        ],
        selected: null,
        statuses: {
          abc123: factory.machineStatus(),
        },
      }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("can dispatch a soft power off action on machines", async () => {
    const store = mockStore(state);

    renderWithBrowserRouter(
      <PowerOffForm
        action={NodeActions.SOFT_OFF}
        actions={machineActions}
        cleanup={machineActions.cleanup}
        clearSidePanelContent={vi.fn()}
        modelName="machine"
        nodes={[state.machine.items[0]]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: /soft power off machine/i,
      })
    );
    expect(
      store.getActions().filter(({ type }) => type === "machine/softOff")
    ).toStrictEqual([
      {
        type: "machine/softOff",
        meta: {
          model: "machine",
          method: "soft_power_off",
        },
        payload: {
          params: {
            action: NodeActions.OFF,
            system_id: "abc123",
            extra: { stop_mode: "soft" },
          },
        },
      },
    ]);
  });
});

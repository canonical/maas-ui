import configureStore from "redux-mock-store";

import SetPoolForm from "./SetPoolForm";

import type { RootState } from "@/app/store/root/types";
import { NodeActions } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { poolsResolvers } from "@/testing/resolvers/pools";
import {
  renderWithBrowserRouter,
  screen,
  setupMockServer,
  userEvent,
} from "@/testing/utils";

const mockStore = configureStore<RootState>();
setupMockServer(poolsResolvers.listPools.handler());

describe("SetPoolForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      machine: factory.machineState({
        errors: {},
        loading: false,
        loaded: true,
        items: [
          factory.machine({
            system_id: "abc123",
          }),
          factory.machine({
            system_id: "def456",
          }),
        ],
        selected: null,
        statuses: {
          abc123: factory.machineStatus({ settingPool: false }),
          def456: factory.machineStatus({ settingPool: false }),
        },
      }),
    });
  });

  it("correctly dispatches actions to set pools of given machines", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <SetPoolForm
        clearSidePanelContent={vi.fn()}
        machines={state.machine.items}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    const poolSelection = screen.getByRole("combobox", {
      name: "Resource pool",
    });
    await userEvent.selectOptions(poolSelection, "pool-1");

    const confirmButton = screen.getByRole("button", {
      name: /Set pool/i,
    });
    await userEvent.click(confirmButton);

    expect(
      store.getActions().filter((action) => action.type === "machine/setPool")
    ).toStrictEqual([
      {
        type: "machine/setPool",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.SET_POOL,
            extra: {
              pool_id: 1,
            },
            system_id: "abc123",
          },
        },
      },
      {
        type: "machine/setPool",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.SET_POOL,
            extra: {
              pool_id: 1,
            },
            system_id: "def456",
          },
        },
      },
    ]);
  });

  it("correctly dispatches action to create and set pool of given machines", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <SetPoolForm
        clearSidePanelContent={vi.fn()}
        machines={state.machine.items}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    await userEvent.click(screen.getByRole("radio", { name: "Create pool" }));

    const nameInput = screen.getByRole("textbox", { name: "Name" });
    await userEvent.type(nameInput, "pool-1");

    const confirmButton = screen.getByRole("button", {
      name: /Set pool/i,
    });
    await userEvent.click(confirmButton);

    expect(
      store
        .getActions()
        .find((action) => action.type === "resourcepool/createWithMachines")
    ).toStrictEqual({
      type: "resourcepool/createWithMachines",
      payload: {
        params: {
          machineIDs: ["abc123", "def456"],
          pool: {
            description: "",
            name: "pool-1",
            poolSelection: "create",
          },
        },
      },
    });
  });
});

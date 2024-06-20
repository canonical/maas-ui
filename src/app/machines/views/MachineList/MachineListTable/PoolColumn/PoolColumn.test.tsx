import configureStore from "redux-mock-store";

import { PoolColumn } from "./PoolColumn";

import type { RootState } from "@/app/store/root/types";
import { NodeActions } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("PoolColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      machine: factory.machineState({
        loaded: true,
        items: [
          factory.machine({
            system_id: "abc123",
            pool: factory.modelRef({ id: 0, name: "default" }),
            description: "Firmware old",
            actions: [NodeActions.SET_POOL],
          }),
        ],
      }),
      resourcepool: factory.resourcePoolState({
        loaded: true,
        items: [
          factory.resourcePool({
            id: 0,
            name: "default",
          }),
          factory.resourcePool({
            id: 1,
            name: "Backup",
          }),
        ],
      }),
    });
  });

  it("displays pool", () => {
    state.machine.items[0].pool = factory.modelRef({ name: "pool-1" });

    renderWithBrowserRouter(
      <PoolColumn onToggleMenu={vi.fn()} systemId="abc123" />,
      {
        route: "/machines",
        state,
      }
    );

    expect(screen.getByTestId("pool")).toHaveTextContent("pool-1");
  });

  it("displays description", () => {
    state.machine.items[0].description = "decomissioned";

    renderWithBrowserRouter(
      <PoolColumn onToggleMenu={vi.fn()} systemId="abc123" />,
      {
        route: "/machines",
        state,
      }
    );

    expect(screen.getByTestId("note")).toHaveTextContent("decomissioned");
  });

  it("displays a message if there are no additional pools", async () => {
    state.resourcepool.items = [
      factory.resourcePool({
        id: 0,
        name: "default",
      }),
    ];

    renderWithBrowserRouter(
      <PoolColumn onToggleMenu={vi.fn()} systemId="abc123" />,
      {
        route: "/machines",
        state,
      }
    );
    await userEvent.click(screen.getByRole("button", { name: "Change pool:" }));
    expect(
      screen.getByRole("button", { name: "No other pools available" })
    ).toBeAriaDisabled();
  });

  it("displays a message if the machine cannot have its pool changed", async () => {
    state.machine.items[0].actions = [];

    renderWithBrowserRouter(
      <PoolColumn onToggleMenu={vi.fn()} systemId="abc123" />,
      {
        route: "/machines",
        state,
      }
    );
    await userEvent.click(screen.getByRole("button", { name: "Change pool:" }));
    expect(
      screen.getByRole("button", {
        name: "Cannot change pool of this machine",
      })
    ).toBeAriaDisabled();
  });

  it("can change pools", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <PoolColumn onToggleMenu={vi.fn()} systemId="abc123" />,
      {
        route: "/machines",
        store,
      }
    );
    await userEvent.click(screen.getByRole("button", { name: "Change pool:" }));
    await userEvent.click(screen.getByRole("button", { name: "Backup" }));

    expect(
      store.getActions().find((action) => action.type === "machine/setPool")
    ).toEqual({
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
    });
  });

  it("shows a spinner when changing pools", async () => {
    renderWithBrowserRouter(
      <PoolColumn onToggleMenu={vi.fn()} systemId="abc123" />,
      {
        route: "/machines",
        state,
      }
    );
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Change pool:" }));
    await userEvent.click(screen.getByRole("button", { name: "Backup" }));
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("does not render table menu if onToggleMenu not provided", () => {
    renderWithBrowserRouter(<PoolColumn systemId="abc123" />, {
      route: "/machines",
      state,
    });

    expect(
      screen.queryByRole("button", { name: "Change pool:" })
    ).not.toBeInTheDocument();
  });
});

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import PoolList from "./PoolList";

import type { RootState } from "app/store/root/types";
import {
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import {
  userEvent,
  screen,
  render,
  within,
  renderWithMockStore,
} from "testing/utils";

const mockStore = configureStore();

describe("PoolList", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      resourcepool: resourcePoolStateFactory({
        loaded: true,
        items: [resourcePoolFactory({ name: "default" })],
      }),
    });
  });

  it("displays a loading component if pools are loading", () => {
    state.resourcepool.loading = true;
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
        <CompatRouter>
          <PoolList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("disables the edit button without permissions", () => {
    state.resourcepool.items = [resourcePoolFactory({ permissions: [] })];
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
        <CompatRouter>
          <PoolList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    expect(screen.getByRole("link", { name: "Edit" })).toHaveClass(
      "is-disabled"
    );
  });

  it("enables the edit button with correct permissions", () => {
    state.resourcepool.items = [resourcePoolFactory({ permissions: ["edit"] })];
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
        <CompatRouter>
          <PoolList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    expect(screen.getByRole("link", { name: "Edit" })).not.toHaveClass(
      "is-disabled"
    );
  });

  it("can show a delete confirmation", async () => {
    state.resourcepool.items = [
      resourcePoolFactory({
        id: 0,
        name: "squambo",
        description: "a pool",
        is_default: false,
        machine_total_count: 0,
        permissions: ["delete"],
      }),
    ];
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
        <CompatRouter>
          <PoolList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    const row = screen.getByRole("row", { name: "squambo" });

    expect(row).not.toHaveClass("is-active");

    // Click on the delete button:
    await userEvent.click(within(row).getByRole("button", { name: "Delete" }));

    expect(row).toHaveClass("is-active");
    expect(
      screen.getByText(
        'Are you sure you want to delete resourcepool "squambo"?'
      )
    ).toBeInTheDocument();
  });

  it("can delete a pool", async () => {
    state.resourcepool.items = [
      resourcePoolFactory({
        id: 2,
        name: "squambo",
        description: "a pool",
        is_default: false,
        machine_total_count: 0,
        permissions: ["delete"],
      }),
    ];
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
          <CompatRouter>
            <PoolList />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const row = screen.getByRole("row", { name: "squambo" });

    // Click on the delete button:
    await userEvent.click(within(row).getByRole("button", { name: "Delete" }));

    // Click on the delete confirm button
    await userEvent.click(
      within(
        within(row).getByRole("gridcell", {
          name: 'Are you sure you want to delete resourcepool "squambo"? This action is permanent and can not be undone. Cancel Delete',
        })
      ).getByRole("button", { name: "Delete" })
    );

    expect(
      store.getActions().find(({ type }) => type === "resourcepool/delete")
    ).toStrictEqual({
      type: "resourcepool/delete",
      payload: {
        params: {
          id: 2,
        },
      },
      meta: {
        model: "resourcepool",
        method: "delete",
      },
    });
  });

  it("disables the delete button for default pools", () => {
    state.resourcepool.items = [
      resourcePoolFactory({
        id: 0,
        name: "default",
        description: "default",
        is_default: true,
        permissions: ["edit", "delete"],
      }),
    ];
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
        <CompatRouter>
          <PoolList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByRole("button", { name: "Delete" })).toBeDisabled();
  });

  it("disables the delete button for pools that contain machines", () => {
    state.resourcepool.items = [
      resourcePoolFactory({
        id: 0,
        name: "machines",
        description: "has machines",
        is_default: false,
        permissions: ["edit", "delete"],
        machine_total_count: 1,
      }),
    ];
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
        <CompatRouter>
          <PoolList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByRole("button", { name: "Delete" })).toBeDisabled();
  });

  it("does not show a machine link for empty pools", () => {
    state.resourcepool.items[0].machine_total_count = 0;
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
        <CompatRouter>
          <PoolList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    const row = screen.getByRole("row", { name: "default" });
    expect(within(row).getByText("Empty pool")).toBeInTheDocument();
  });

  it("can show a machine link for non-empty pools", () => {
    state.resourcepool.items[0].machine_total_count = 5;
    state.resourcepool.items[0].machine_ready_count = 1;
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
        <CompatRouter>
          <PoolList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    const link = within(screen.getByRole("row", { name: "default" })).getByRole(
      "link",
      { name: "1 of 5 ready" }
    );
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/machines?pool=%3Ddefault");
  });

  it("displays state errors in a notification", () => {
    state.resourcepool.errors = "Pools are not for swimming.";
    renderWithMockStore(
      <MemoryRouter initialEntries={[{ pathname: "/pools", key: "testKey" }]}>
        <CompatRouter>
          <PoolList />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByText("Pools are not for swimming.")).toBeInTheDocument();
  });
});

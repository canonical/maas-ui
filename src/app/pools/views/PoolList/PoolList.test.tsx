import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";

import PoolList from "./PoolList";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  screen,
  within,
  renderWithMockStore,
  renderWithBrowserRouter,
} from "@/testing/utils";

describe("PoolList", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      resourcepool: factory.resourcePoolState({
        loaded: true,
        items: [factory.resourcePool({ name: "default" })],
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
    state.resourcepool.items = [factory.resourcePool({ permissions: [] })];
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
    state.resourcepool.items = [
      factory.resourcePool({ permissions: ["edit"] }),
    ];
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

  it("displays a link to delete confirmation", async () => {
    state.resourcepool.items = [
      factory.resourcePool({
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

    expect(
      within(row).getByRole("link", { name: "Delete" })
    ).toBeInTheDocument();
  });

  it("disables the delete button for default pools", () => {
    state.resourcepool.items = [
      factory.resourcePool({
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
    expect(screen.getByRole("link", { name: "Delete" })).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  it("disables the delete button for pools that contain machines", () => {
    state.resourcepool.items = [
      factory.resourcePool({
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
    expect(screen.getByRole("link", { name: "Delete" })).toHaveAttribute(
      "aria-disabled",
      "true"
    );
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

  it("displays a message when rendering an empty list", () => {
    state.resourcepool.items = [];
    renderWithBrowserRouter(<PoolList />, { state, route: "/pools" });

    expect(screen.getByText("No pools available.")).toBeInTheDocument();
  });
});

import PoolList from "./PoolList";

import * as factory from "@/testing/factories";
import { poolsResolvers } from "@/testing/resolvers/pools";
import {
  screen,
  within,
  renderWithMockStore,
  renderWithBrowserRouter,
  mockIsPending,
  renderWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(poolsResolvers.listPools.handler());

describe("PoolList", () => {
  it("displays a loading component if pools are loading", async () => {
    mockIsPending();
    renderWithMockStore(<PoolList />);

    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  it("disables the edit button without permissions", async () => {
    mockServer.use(
      poolsResolvers.listPools.handler({
        items: [factory.resourcePool({ permissions: [] })],
        total: 1,
      })
    );
    renderWithProviders(<PoolList />);

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Edit" })).toHaveClass(
        "is-disabled"
      );
    });
  });

  it("enables the edit button with correct permissions", async () => {
    mockServer.use(
      poolsResolvers.listPools.handler({
        items: [factory.resourcePool({ permissions: ["edit"] })],
        total: 1,
      })
    );

    renderWithProviders(<PoolList />);

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Edit" })).not.toHaveClass(
        "is-disabled"
      );
    });
  });

  it("displays a link to delete confirmation", async () => {
    mockServer.use(
      poolsResolvers.listPools.handler({
        items: [
          factory.resourcePool({
            id: 0,
            name: "squambo",
            description: "a pool",
            is_default: false,
            machine_total_count: 0,
            permissions: ["delete"],
          }),
        ],
        total: 1,
      })
    );

    renderWithProviders(<PoolList />);

    await waitFor(() => {
      expect(screen.getByRole("row", { name: "squambo" })).toBeInTheDocument();
    });
    const row = screen.getByRole("row", { name: "squambo" });
    expect(row).not.toHaveClass("is-active");

    await waitFor(() => {
      expect(
        within(row).getByRole("link", { name: "Delete" })
      ).toBeInTheDocument();
    });
  });

  it("disables the delete button for default pools", async () => {
    mockServer.use(
      poolsResolvers.listPools.handler({
        items: [
          factory.resourcePool({
            id: 0,
            name: "default",
            description: "default",
            is_default: true,
            permissions: ["edit", "delete"],
          }),
        ],
        total: 1,
      })
    );

    renderWithProviders(<PoolList />);

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Delete" })).toBeAriaDisabled();
    });
  });

  it("disables the delete button for pools that contain machines", async () => {
    mockServer.use(
      poolsResolvers.listPools.handler({
        items: [
          factory.resourcePool({
            id: 0,
            name: "machines",
            description: "has machines",
            is_default: false,
            permissions: ["edit", "delete"],
            machine_total_count: 1,
          }),
        ],
        total: 1,
      })
    );

    renderWithProviders(<PoolList />);

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Delete" })).toBeAriaDisabled();
    });
  });

  it("does not show a machine link for empty pools", async () => {
    mockServer.use(
      poolsResolvers.listPools.handler({
        items: [
          factory.resourcePool({ name: "default", machine_total_count: 0 }),
        ],
        total: 1,
      })
    );

    renderWithProviders(<PoolList />);
    await waitFor(() => {
      expect(screen.getByRole("row", { name: "default" })).toBeInTheDocument();
    });
    const row = screen.getByRole("row", { name: "default" });
    expect(within(row).getByText("Empty pool")).toBeInTheDocument();
  });

  it("can show a machine link for non-empty pools", async () => {
    mockServer.use(
      poolsResolvers.listPools.handler({
        items: [
          factory.resourcePool({
            name: "default",
            machine_total_count: 5,
            machine_ready_count: 1,
          }),
        ],
        total: 1,
      })
    );

    renderWithProviders(<PoolList />);
    await waitFor(() => {
      expect(screen.getByRole("row", { name: "default" })).toBeInTheDocument();
    });
    const link = within(screen.getByRole("row", { name: "default" })).getByRole(
      "link",
      { name: "1 of 5 ready" }
    );
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/machines?pool=%3Ddefault");
  });

  it("displays state errors in a notification", async () => {
    mockServer.use(
      poolsResolvers.listPools.error({ 
        message: "Pools are not for swimming.",
        code: 401,
      })
    );

    renderWithProviders(<PoolList />);

    await waitFor(() => {
      expect(poolsResolvers.listPools.resolved).toBeTruthy();
    });

    await waitFor(() => {
      expect(
        screen.getByText("Pools are not for swimming.")
      ).toBeInTheDocument();
    });
  });

  it("displays a message when rendering an empty list", async () => {
    mockServer.use(poolsResolvers.listPools.handler({ items: [], total: 0 }));
    renderWithBrowserRouter(<PoolList />, { route: "/pools" });

    await waitFor(() => {
      expect(screen.getByText("No pools available.")).toBeInTheDocument();
    });
  });
});

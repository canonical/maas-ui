import PoolList from "./PoolList";

import * as factory from "@/testing/factories";
import { poolsResolvers } from "@/testing/resolvers/pools";
import {
  screen,
  renderWithMockStore,
  renderWithBrowserRouter,
  mockIsPending,
  renderWithProviders,
  setupMockServer,
  waitFor,
  within,
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
      expect(screen.getByRole("cell", { name: "squambo" })).toBeInTheDocument();
    });
    const cell = screen.getByRole("cell", { name: "squambo" });
    const row = cell.closest("tr")!;
    expect(row).not.toHaveClass("is-active");

    await waitFor(() => {
      expect(
        within(row).getByRole("link", { name: "Delete" })
      ).toBeInTheDocument();
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
      expect(screen.getByRole("cell", { name: "default" })).toBeInTheDocument();
    });
    const cell = screen.getByRole("cell", { name: "default" });
    const row = cell.closest("tr")!;
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
      expect(screen.getByRole("cell", { name: "default" })).toBeInTheDocument();
    });
    const link = within(
      screen.getByRole("cell", { name: "default" }).closest("tr")!
    ).getByRole("link", { name: "1 of 5 ready" });
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
      expect(screen.getByText("No pools found.")).toBeInTheDocument();
    });
  });
});

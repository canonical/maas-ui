import PoolsTable from "./PoolsTable";

import * as factory from "@/testing/factories";
import { poolsResolvers } from "@/testing/resolvers/pools";
import {
  renderWithProviders,
  screen,
  waitFor,
  setupMockServer,
} from "@/testing/utils";

const mockServer = setupMockServer(
  poolsResolvers.listPools.handler(),
  poolsResolvers.getPool.handler()
);

describe("PoolsTable", () => {
  it("disables the edit button without permissions", async () => {
    mockServer.use(
      poolsResolvers.listPools.handler({
        items: [factory.resourcePool({ permissions: [] })],
        total: 1,
      })
    );
    renderWithProviders(<PoolsTable />);

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

    renderWithProviders(<PoolsTable />);

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Edit" })).not.toHaveClass(
        "is-disabled"
      );
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

    renderWithProviders(<PoolsTable />);

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

    renderWithProviders(<PoolsTable />);

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Delete" })).toBeAriaDisabled();
    });
  });
});

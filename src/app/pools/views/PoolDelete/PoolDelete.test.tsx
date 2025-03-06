import PoolDelete from "./PoolDelete";

import { poolsResolvers } from "@/testing/resolvers/pools";
import {
  renderWithBrowserRouter,
  screen,
  setupMockServer,
  userEvent,
} from "@/testing/utils";

setupMockServer(poolsResolvers.deletePool.handler());

it("can delete a resource pool", async () => {
  renderWithBrowserRouter(<PoolDelete />, {
    route: "/pools/1/delete",
    routePattern: "/pools/:id/delete",
  });

  expect(
    screen.getByRole("form", { name: /Confirm pool deletion/i })
  ).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: /delete/i }));

  expect(poolsResolvers.deletePool.resolved).toBe(true);
});

import PoolDeleteForm from "./PoolDeleteForm";

import { poolsResolvers } from "@/testing/resolvers/pools";
import {
  screen,
  renderWithBrowserRouter,
  setupMockServer,
  userEvent,
  waitFor,
  renderWithProviders,
} from "@/testing/utils";

const mockServer = setupMockServer(poolsResolvers.deletePool.handler());

describe("PoolDeleteForm", () => {
  it("renders", () => {
    renderWithProviders(<PoolDeleteForm id={1} />, {
      route: "/",
    });

    expect(screen.getByRole("form", { name: "Confirm pool deletion" }));
  });

  it("can delete a pool", async () => {
    renderWithBrowserRouter(<PoolDeleteForm id={1} />);

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(poolsResolvers.deletePool.resolved).toBe(true);
    });
  });

  it("can show errors encountered when deleting a pool", async () => {
    mockServer.use(
      poolsResolvers.deletePool.error({ message: "Uh oh!", code: 404 })
    );
    renderWithBrowserRouter(<PoolDeleteForm id={1} />);

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByText("Uh oh!")).toBeInTheDocument();
    });
  });
});

import DeletePool from "./DeletePool";

import { poolsResolvers } from "@/testing/resolvers/pools";
import {
  renderWithBrowserRouter,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(poolsResolvers.deletePool.handler());

describe("PoolDeleteForm", () => {
  it("renders", () => {
    renderWithProviders(<DeletePool closeForm={vi.fn()} id={1} />);

    expect(screen.getByRole("form", { name: "Confirm pool deletion" }));
  });

  it("can delete a resource pool", async () => {
    renderWithBrowserRouter(<DeletePool closeForm={vi.fn()} id={1} />);

    expect(
      screen.getByRole("form", { name: /Confirm pool deletion/i })
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(poolsResolvers.deletePool.resolved).toBe(true);
  });

  it("can show errors encountered when deleting a pool", async () => {
    mockServer.use(
      poolsResolvers.deletePool.error({ message: "Uh oh!", code: 404 })
    );
    renderWithProviders(<DeletePool closeForm={vi.fn()} id={1} />);

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByText("Uh oh!")).toBeInTheDocument();
    });
  });
});

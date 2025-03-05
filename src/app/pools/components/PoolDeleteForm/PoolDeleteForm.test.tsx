import PoolDeleteForm from "./PoolDeleteForm";

import { useCreatePool } from "@/app/api/query/pools";
import { poolsResolvers } from "@/testing/resolvers/pools";
import {
  screen,
  renderWithBrowserRouter,
  setupMockServer,
  userEvent,
  waitFor,
  renderHookWithProviders,
} from "@/testing/utils";

const mockServer = setupMockServer(poolsResolvers.deletePool.handler());

describe("PoolDeleteForm", () => {
  it("renders", () => {
    renderWithBrowserRouter(<PoolDeleteForm id={1} />, {
      route: "/",
    });

    expect(screen.getByRole("form", { name: "Confirm pool deletion" }));
  });

  it("can delete a pool", async () => {
    renderWithBrowserRouter(<PoolDeleteForm id={1} />);
    const newPool = { name: "testPool", description: "testDescription" };
    const { result } = renderHookWithProviders(() => useCreatePool());
    result.current.mutate({ body: newPool });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(poolsResolvers.deletePool.resolved).toBeTruthy();
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

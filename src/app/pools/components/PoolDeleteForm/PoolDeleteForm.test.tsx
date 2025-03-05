import PoolDeleteForm from "./PoolDeleteForm";
import { PoolForm, Labels as PoolFormLabels } from "./PoolForm";

import urls from "@/app/base/urls";
import { poolsResolvers } from "@/testing/resolvers/pools";
import {
  screen,
  renderWithBrowserRouter,
  setupMockServer,
  userEvent,
  waitFor,
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
    renderWithBrowserRouter(<PoolForm />, {
      route: urls.pools.add,
      routePattern: `${urls.pools.index}/*`,
    });
    await userEvent.type(
      screen.getByRole("textbox", { name: PoolFormLabels.PoolName }),
      "swimming"
    );
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

import { waitFor } from "@testing-library/react";

import EditPool from "@/app/pools/components/EditPool/EditPool";
import * as factory from "@/testing/factories";
import { poolsResolvers } from "@/testing/resolvers/pools";
import {
  userEvent,
  screen,
  renderWithBrowserRouter,
  setupMockServer,
  renderWithProviders,
} from "@/testing/utils";

setupMockServer(
  poolsResolvers.getPool.handler(),
  poolsResolvers.updatePool.handler()
);

describe("EditPool", () => {
  it("can render", async () => {
    renderWithBrowserRouter(<EditPool closeForm={vi.fn()} id={1} />, {
      route: "/",
    });

    await waitFor(() => {
      expect(screen.getByRole("form", { name: "Edit pool" }));
    });
  });

  it("can update a resource pool", async () => {
    const pool = factory.resourcePool({ id: 1 });

    renderWithProviders(<EditPool closeForm={vi.fn()} id={pool.id} />);

    await waitFor(() => {
      expect(screen.getByRole("form", { name: "Edit pool" }));
    });

    const name_textbox = screen.getByRole("textbox", {
      name: "Name (required)",
    });
    const description_textbox = screen.getByRole("textbox", {
      name: "Description",
    });

    await userEvent.clear(name_textbox);
    await userEvent.clear(description_textbox);

    await userEvent.type(name_textbox, "newName");
    await userEvent.type(description_textbox, "newDescription");

    await userEvent.click(screen.getByRole("button", { name: "Save pool" }));

    await waitFor(() => {
      expect(poolsResolvers.updatePool.resolved).toBe(true);
    });
  });
});

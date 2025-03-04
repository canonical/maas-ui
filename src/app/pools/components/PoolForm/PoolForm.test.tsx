import { waitFor } from "@testing-library/react";

import { PoolForm, Labels as PoolFormLabels } from "./PoolForm";

import urls from "@/app/base/urls";
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
  poolsResolvers.createPool.handler(),
  poolsResolvers.updatePool.handler()
);

describe("PoolForm", () => {
  it("can render", () => {
    renderWithBrowserRouter(<PoolForm />, {
      route: "/",
    });

    expect(screen.getByRole("form", { name: PoolFormLabels.AddPoolTitle }));
  });

  it("redirects when the resource pool is saved", async () => {
    renderWithBrowserRouter(<PoolForm />, {
      route: urls.pools.add,
      routePattern: `${urls.pools.index}/*`,
    });
    await userEvent.type(
      screen.getByRole("textbox", { name: PoolFormLabels.PoolName }),
      "swimming"
    );
    await userEvent.click(
      screen.getByRole("button", { name: PoolFormLabels.SubmitLabel })
    );
    await waitFor(() => {
      expect(window.location.pathname).toBe(urls.pools.index);
    });
  });

  it("can create a resource pool", async () => {
    renderWithProviders(<PoolForm />);

    await userEvent.type(
      screen.getByRole("textbox", { name: PoolFormLabels.PoolName }),
      "test name"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: PoolFormLabels.PoolDescription }),
      "test description"
    );

    await userEvent.click(
      screen.getByRole("button", { name: PoolFormLabels.SubmitLabel })
    );

    await waitFor(() => {
      expect(poolsResolvers.createPool.resolved).toBe(true);
    });
  });

  it("can update a resource pool", async () => {
    const pool = factory.resourcePool({ id: 1 });

    renderWithProviders(<PoolForm pool={pool} />);

    const name_textbox = screen.getByRole("textbox", {
      name: PoolFormLabels.PoolName,
    });
    const description_textbox = screen.getByRole("textbox", {
      name: PoolFormLabels.PoolDescription,
    });

    await userEvent.clear(name_textbox);
    await userEvent.clear(description_textbox);

    await userEvent.type(name_textbox, "newName");
    await userEvent.type(description_textbox, "newDescription");

    await userEvent.click(
      screen.getByRole("button", { name: PoolFormLabels.SubmitLabel })
    );

    await waitFor(() => {
      expect(poolsResolvers.updatePool.resolved).toBe(true);
    });
  });
});

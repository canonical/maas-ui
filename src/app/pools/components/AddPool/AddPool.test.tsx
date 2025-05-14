import { waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";

import AddPool from "./AddPool";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { poolsResolvers } from "@/testing/resolvers/pools";
import {
  screen,
  renderWithMockStore,
  renderWithProviders,
  userEvent,
  setupMockServer,
} from "@/testing/utils";

setupMockServer(poolsResolvers.createPool.handler());

describe("AddPool", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState();
  });

  it("can render", () => {
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/pool/add", key: "testKey" }]}
      >
        <AddPool closeForm={vi.fn()} />
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByRole("form", { name: "Add pool" }));
  });

  it("can create a resource pool", async () => {
    renderWithProviders(<AddPool closeForm={vi.fn()} />);

    await userEvent.type(
      screen.getByRole("textbox", { name: "Name (required)" }),
      "test name"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: "Description" }),
      "test description"
    );

    await userEvent.click(screen.getByRole("button", { name: "Save pool" }));

    await waitFor(() => {
      expect(poolsResolvers.createPool.resolved).toBe(true);
    });
  });
});

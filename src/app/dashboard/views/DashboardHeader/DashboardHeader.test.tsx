import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DashboardHeader, {
  Labels as DashboardHeaderLabels,
} from "./DashboardHeader";

import urls from "app/base/urls";
import type { RootState } from "app/store/root/types";
import {
  discovery as discoveryFactory,
  discoveryState as discoveryStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

describe("DashboardHeader", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      discovery: discoveryStateFactory({
        loaded: true,
        items: [
          discoveryFactory({
            hostname: "my-discovery-test",
          }),
          discoveryFactory({
            hostname: "another-test",
          }),
        ],
      }),
    });
  });

  it("displays the discovery count in the header", () => {
    renderWithBrowserRouter(<DashboardHeader />, {
      route: "/dashboard",
      state,
    });

    const indexLink = screen.getByText("2 discoveries");
    expect(indexLink).toBeInTheDocument();
    expect(indexLink).toHaveProperty(
      "href",
      `http://example.com${urls.dashboard.index}`
    );
  });

  it("has a button to clear discoveries", () => {
    renderWithBrowserRouter(<DashboardHeader />, {
      route: "/dashboard",
      state,
    });
    expect(
      screen.getByRole("button", { name: DashboardHeaderLabels.ClearAll })
    ).toBeInTheDocument();
  });

  it("hides the clear-all button when the form is visible", async () => {
    renderWithBrowserRouter(<DashboardHeader />, {
      route: "/dashboard",
      state,
    });

    const clearAllButton = screen.getByRole("button", {
      name: DashboardHeaderLabels.ClearAll,
    });

    await userEvent.click(clearAllButton);
    expect(clearAllButton).not.toBeInTheDocument();
  });
});

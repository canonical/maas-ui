import ZoneDetailsHeader from "./ZoneDetailsHeader";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  renderWithBrowserRouter,
  screen,
  waitFor,
  within,
} from "@/testing/utils";

describe("ZoneDetailsHeader", () => {
  let state: RootState;
  const queryData = {
    zones: [
      factory.zone({ id: 1, name: "zone-name" }),
      factory.zone({ id: 2, name: "zone-name-2" }),
    ],
  };

  beforeEach(() => {
    state = factory.rootState({
      user: factory.userState({
        auth: factory.authState({
          user: factory.user({ is_superuser: true }),
        }),
      }),
      zone: factory.zoneState({
        genericActions: factory.zoneGenericActions({ fetch: "success" }),
      }),
    });
  });

  it("displays zone name in header if one exists", async () => {
    renderWithBrowserRouter(<ZoneDetailsHeader id={1} />, {
      state,
      queryData,
      route: "/zone/1",
    });

    await waitFor(() => {
      expect(screen.getByTestId("section-header-title")).toHaveTextContent(
        "Availability zone: zone-name"
      );
    });
  });

  it("displays not found message if no zone exists", async () => {
    renderWithBrowserRouter(<ZoneDetailsHeader id={3} />, {
      state,
      queryData,
      route: "/zone/3",
    });

    const { findByText } = within(
      await screen.findByTestId("section-header-title")
    );
    expect(await findByText("Availability zone not found")).toBeInTheDocument();
  });

  it("shows delete az button when zone id isn't 1", async () => {
    renderWithBrowserRouter(<ZoneDetailsHeader id={2} />, {
      state,
      queryData,
      route: "/zone/2",
    });

    expect(
      await screen.findByRole("button", { name: "Delete AZ" })
    ).toBeInTheDocument();
  });

  it("hides delete button when zone id is 1 (as this is the default)", () => {
    renderWithBrowserRouter(<ZoneDetailsHeader id={1} />, {
      state,
      queryData,
      route: "/zone/1",
    });

    expect(screen.queryByTestId("delete-zone")).not.toBeInTheDocument();
  });

  it("hides delete button for all zones when user isn't admin", () => {
    const nonAdminState = factory.rootState({
      user: factory.userState({
        auth: factory.authState({
          user: factory.user({ is_superuser: false }),
        }),
      }),
    });

    renderWithBrowserRouter(<ZoneDetailsHeader id={2} />, {
      state: nonAdminState,
      queryData,
      route: "/zone/2",
    });

    expect(screen.queryByTestId("delete-zone")).not.toBeInTheDocument();
  });
});

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
});

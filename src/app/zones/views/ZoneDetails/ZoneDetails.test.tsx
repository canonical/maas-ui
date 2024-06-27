import ZoneDetails from "./ZoneDetails";

import { Labels } from "@/app/base/components/EditableSection";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen } from "@/testing/utils";

describe("ZoneDetails", () => {
  const testZones = [
    factory.zone({
      id: 1,
      name: "zone-name",
    }),
  ];
  let state: RootState;
  const queryData = { zones: testZones };
  beforeEach(() => {
    state = factory.rootState({
      user: factory.userState({
        auth: factory.authState({
          user: factory.user({ is_superuser: true }),
        }),
      }),
    });
  });

  it("shows Edit button if user is admin", () => {
    renderWithBrowserRouter(<ZoneDetails />, {
      route: "/zone/1",
      routePattern: "/zone/:id",
      queryData,
      state,
    });

    const editButtons = screen.getAllByRole("button", {
      name: Labels.EditButton,
    });
    editButtons.forEach((button) => expect(button).toBeInTheDocument());
  });

  it("hides Edit button if user is not admin", () => {
    const state = factory.rootState({
      user: factory.userState({
        auth: factory.authState({
          user: factory.user({ is_superuser: false }),
        }),
      }),
    });
    renderWithBrowserRouter(<ZoneDetails />, {
      route: "/zone/1",
      routePattern: "/zone/:id",
      queryData,
      state,
    });

    const editButtons = screen.queryAllByRole("button", {
      name: Labels.EditButton,
    });
    editButtons.forEach((button) => expect(button).not.toBeInTheDocument());
  });
});

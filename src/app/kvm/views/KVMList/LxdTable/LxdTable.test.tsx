import LxdTable from "./LxdTable";

import { PodType } from "app/store/pod/constants";
import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

describe("LxdTable", () => {
  it("displays a spinner while loading", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        loading: true,
      }),
    });

    renderWithBrowserRouter(<LxdTable />, { route: "/kvm", state });
    expect(screen.getByTestId("loading-table")).toBeInTheDocument();
  });

  it("displays the table when loaded", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            type: PodType.LXD,
          }),
        ],
        loading: false,
        loaded: true,
      }),
    });
    renderWithBrowserRouter(<LxdTable />, { route: "/kvm", state });
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });
});

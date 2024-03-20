import LxdTable from "./LxdTable";

import { PodType } from "@/app/store/pod/constants";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen } from "@/testing/utils";

describe("LxdTable", () => {
  it("displays a spinner while loading", () => {
    const state = factory.rootState({
      pod: factory.podState({
        loading: true,
      }),
    });

    renderWithBrowserRouter(<LxdTable />, { route: "/kvm", state });
    expect(screen.getByTestId("loading-table")).toBeInTheDocument();
  });

  it("displays the table when loaded", () => {
    const state = factory.rootState({
      pod: factory.podState({
        items: [
          factory.pod({
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

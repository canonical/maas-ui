import DiscoveriesFilterAccordion, {
  Labels as DiscoveriesFilterAccordionLabels,
} from "./DiscoveriesFilterAccordion";

import type { RootState } from "app/store/root/types";
import {
  discoveryState as discoveryStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, renderWithBrowserRouter } from "testing/utils";

const route = "/discoveries";

describe("DiscoveriesFilterAccordion", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      discovery: discoveryStateFactory({
        loaded: true,
      }),
    });
  });

  it("button is disabled when loading discoveries", () => {
    state.discovery.loaded = false;
    renderWithBrowserRouter(
      <DiscoveriesFilterAccordion searchText="" setSearchText={jest.fn()} />,
      { route, state }
    );
    expect(screen.getByRole("button", { name: "Filters" })).toBeDisabled();
  });

  it("displays a filter accordion", () => {
    renderWithBrowserRouter(
      <DiscoveriesFilterAccordion searchText="" setSearchText={jest.fn()} />,
      { route, state }
    );
    expect(
      screen.getByLabelText(DiscoveriesFilterAccordionLabels.FilterDiscoveries)
    ).toBeInTheDocument();
  });
});

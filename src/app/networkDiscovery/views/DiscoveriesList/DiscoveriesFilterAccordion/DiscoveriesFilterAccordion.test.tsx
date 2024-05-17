import DiscoveriesFilterAccordion, {
  Labels as DiscoveriesFilterAccordionLabels,
} from "./DiscoveriesFilterAccordion";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithBrowserRouter } from "@/testing/utils";

const route = "/discoveries";

describe("DiscoveriesFilterAccordion", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      discovery: factory.discoveryState({
        loaded: true,
      }),
    });
  });

  it("button is disabled when loading discoveries", () => {
    state.discovery.loaded = false;
    renderWithBrowserRouter(
      <DiscoveriesFilterAccordion searchText="" setSearchText={vi.fn()} />,
      { route, state }
    );
    expect(screen.getByRole("button", { name: "Filters" })).toHaveAttribute(
      "aria-disabled"
    );
  });

  it("displays a filter accordion", () => {
    renderWithBrowserRouter(
      <DiscoveriesFilterAccordion searchText="" setSearchText={vi.fn()} />,
      { route, state }
    );
    expect(
      screen.getByLabelText(DiscoveriesFilterAccordionLabels.FilterDiscoveries)
    ).toBeInTheDocument();
  });
});

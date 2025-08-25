import DiscoveriesFilterAccordion, {
  Labels as DiscoveriesFilterAccordionLabels,
} from "./DiscoveriesFilterAccordion";

import { screen, renderWithBrowserRouter } from "@/testing/utils";

const route = "/discoveries";

describe("DiscoveriesFilterAccordion", () => {
  it("button is disabled when loading discoveries", () => {
    renderWithBrowserRouter(
      <DiscoveriesFilterAccordion searchText="" setSearchText={vi.fn()} />,
      { route }
    );
    expect(screen.getByRole("button", { name: "Filters" })).toBeAriaDisabled();
  });

  it("displays a filter accordion", () => {
    renderWithBrowserRouter(
      <DiscoveriesFilterAccordion searchText="" setSearchText={vi.fn()} />,
      { route }
    );
    expect(
      screen.getByLabelText(DiscoveriesFilterAccordionLabels.FilterDiscoveries)
    ).toBeInTheDocument();
  });
});

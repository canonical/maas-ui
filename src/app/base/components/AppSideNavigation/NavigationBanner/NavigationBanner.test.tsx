import NavigationBanner from "./NavigationBanner";

import { screen, renderWithBrowserRouter } from "testing/utils";

afterEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
});

it("displays a link to the homepage", () => {
  renderWithBrowserRouter(<NavigationBanner />, { route: "/" });

  expect(screen.getByRole("link", { name: /Homepage/ })).toBeInTheDocument();
});

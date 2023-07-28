/* eslint-disable testing-library/no-container */
import NotFound from "./NotFound";

import { renderWithBrowserRouter, screen } from "testing/utils";

describe("NotFound ", () => {
  it("can render", () => {
    const { container } = renderWithBrowserRouter(<NotFound />, {
      route: "/404",
    });
    expect(screen.getByText(/Page not found/i)).toBeInTheDocument();

    expect(container.querySelector("section")).not.toBeInTheDocument();
  });

  it("can render in a section", () => {
    const { container } = renderWithBrowserRouter(<NotFound includeSection />, {
      route: "/404",
    });
    expect(container.querySelector("section")).toBeInTheDocument();
  });
});

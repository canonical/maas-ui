import { screen, render } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";

import { Nav } from "./Nav";

describe("Nav", () => {
  it("renders", () => {
    render(
      <MemoryRouter
        initialEntries={[{ pathname: "/prefs", key: "testKey" }]}
        initialIndex={0}
      >
        <CompatRouter>
          <Route path="/prefs" render={() => <Nav />} />
        </CompatRouter>
      </MemoryRouter>
    );
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass("p-side-navigation");
  });
});

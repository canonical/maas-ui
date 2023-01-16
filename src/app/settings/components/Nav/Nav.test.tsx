import { MemoryRouter, Route } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";

import { Nav } from "./Nav";

import { screen, render } from "testing/utils";

describe("Nav", () => {
  it("renders", () => {
    render(
      <MemoryRouter
        initialEntries={[{ pathname: "/settings", key: "testKey" }]}
        initialIndex={0}
      >
        <CompatRouter>
          <Route path="/settings" render={() => <Nav />} />
        </CompatRouter>
      </MemoryRouter>
    );
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});

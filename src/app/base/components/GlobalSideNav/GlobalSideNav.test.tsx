import GlobalSideNav from "./GlobalSideNav";

import { screen, render } from "testing/utils";

describe("GlobalSideNav", () => {
  it("renders", () => {
    render(<GlobalSideNav />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});

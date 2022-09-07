import { screen } from "@testing-library/react";

import IncompleteCard, {
  Labels as IncompleteCardLabels,
} from "./IncompleteCard";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

describe("IncompleteCard", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory();
  });

  it("renders", () => {
    renderWithBrowserRouter(<IncompleteCard />, {
      route: "/intro/user",
      wrapperProps: { state },
    });
    expect(screen.getByText(IncompleteCardLabels.Welcome)).toBeInTheDocument();
    expect(screen.getByText(IncompleteCardLabels.Help)).toBeInTheDocument();
    expect(
      screen.getByText(IncompleteCardLabels.Incomplete)
    ).toBeInTheDocument();
  });
});

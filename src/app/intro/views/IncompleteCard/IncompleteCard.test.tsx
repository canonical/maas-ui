import IncompleteCard, {
  Labels as IncompleteCardLabels,
} from "./IncompleteCard";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithBrowserRouter } from "@/testing/utils";

describe("IncompleteCard", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState();
  });

  it("renders", () => {
    renderWithBrowserRouter(<IncompleteCard />, {
      route: "/intro/user",
      state,
    });
    expect(screen.getByText(IncompleteCardLabels.Welcome)).toBeInTheDocument();
    expect(screen.getByText(IncompleteCardLabels.Help)).toBeInTheDocument();
    expect(
      screen.getByText(IncompleteCardLabels.Incomplete)
    ).toBeInTheDocument();
  });
});

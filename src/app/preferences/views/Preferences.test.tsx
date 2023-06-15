import Preferences, { Labels as PreferencesLabels } from "./Preferences";

import { screen, renderWithBrowserRouter, getTestState } from "testing/utils";

describe("Preferences", () => {
  it("renders", () => {
    const state = getTestState();
    renderWithBrowserRouter(<Preferences />, { route: "/preferences", state });

    expect(screen.getByLabelText(PreferencesLabels.Title)).toBeInTheDocument();
  });
});

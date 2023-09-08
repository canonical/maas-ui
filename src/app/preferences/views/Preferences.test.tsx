import Preferences, { Labels as PreferencesLabels } from "./Preferences";

import { screen, renderWithBrowserRouter } from "testing/utils";

describe("Preferences", () => {
  it("renders", () => {
    renderWithBrowserRouter(<Preferences />, { route: "/preferences" });

    expect(screen.getByLabelText(PreferencesLabels.Title)).toBeInTheDocument();
  });
});

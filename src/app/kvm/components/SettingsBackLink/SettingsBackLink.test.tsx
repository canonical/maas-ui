import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { HistoryRouter as Router } from "redux-first-history/rr6";

import SettingsBackLink from "./SettingsBackLink";

describe("SettingsBackLink", () => {
  it("does not render is no from is provided", () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <SettingsBackLink />
      </Router>
    );

    const link = screen.queryByText(/Settings/i);
    expect(link).not.toBeInTheDocument();
  });

  it("links back to previous state when provided", () => {
    const expectedReturnURL = "/kvm/lxd/cluster/20/hosts";
    const locationState = { from: expectedReturnURL };
    const history = createMemoryHistory();
    history.push(`/MAAS/r${expectedReturnURL}`, locationState);

    render(
      <Router history={history}>
        <SettingsBackLink />
      </Router>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `${expectedReturnURL}`);
  });
});

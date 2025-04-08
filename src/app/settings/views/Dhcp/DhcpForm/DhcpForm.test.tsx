import { createMemoryHistory } from "history";
import { MemoryRouter } from "react-router";
import { HistoryRouter as Router } from "redux-first-history/rr6";

import { DhcpForm } from "./DhcpForm";

import settingsURLs from "@/app/settings/urls";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithMockStore } from "@/testing/utils";

describe("DhcpForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      dhcpsnippet: factory.dhcpSnippetState({
        items: [
          factory.dhcpSnippet({
            id: 1,
            name: "lease",
            value: "lease 10",
          }),
          factory.dhcpSnippet({
            id: 2,
            name: "class",
          }),
        ],
        loaded: true,
      }),
    });
  });

  it("can render", () => {
    renderWithMockStore(
      <MemoryRouter initialEntries={["/"]}>
        <DhcpForm />
      </MemoryRouter>,
      { state }
    );
    expect(
      screen.getByRole("form", { name: "Add DHCP snippet" })
    ).toBeInTheDocument();
  });

  it("redirects when the snippet is saved", () => {
    state.dhcpsnippet.saved = true;
    const history = createMemoryHistory({
      initialEntries: ["/"],
    });
    renderWithMockStore(
      <Router history={history}>
        <DhcpForm />
      </Router>,
      { state }
    );
    expect(history.location.pathname).toBe(settingsURLs.dhcp.index);
  });

  it("shows the snippet name in the title when editing", () => {
    renderWithMockStore(
      <MemoryRouter initialEntries={["/"]}>
        <DhcpForm dhcpSnippet={state.dhcpsnippet.items[0]} />
      </MemoryRouter>,
      { state }
    );

    expect(
      screen.getByRole("form", { name: "Editing `lease`" })
    ).toBeInTheDocument();
  });
});

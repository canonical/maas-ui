import { createMemoryHistory } from "history";
import { MemoryRouter, Router } from "react-router-dom";
import { CompatRouter } from "react-router-dom";

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
            created: "Thu, 15 Aug. 2019 06:21:39",
            id: 1,
            name: "lease",
            updated: "Thu, 15 Aug. 2019 06:21:39",
            value: "lease 10",
          }),
          factory.dhcpSnippet({
            created: "Thu, 15 Aug. 2019 06:21:39",
            id: 2,
            name: "class",
            updated: "Thu, 15 Aug. 2019 06:21:39",
          }),
        ],
        loaded: true,
      }),
    });
  });

  it("can render", () => {
    renderWithMockStore(
      <MemoryRouter initialEntries={["/"]}>
        <CompatRouter>
          <DhcpForm />
        </CompatRouter>
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
        <CompatRouter>
          <DhcpForm />
        </CompatRouter>
      </Router>,
      { state }
    );
    expect(history.location.pathname).toBe(settingsURLs.dhcp.index);
  });

  it("shows the snippet name in the title when editing", () => {
    renderWithMockStore(
      <MemoryRouter initialEntries={["/"]}>
        <CompatRouter>
          <DhcpForm dhcpSnippet={state.dhcpsnippet.items[0]} />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );

    expect(
      screen.getByRole("form", { name: "Editing `lease`" })
    ).toBeInTheDocument();
  });
});

import { screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";

import IntroSection from "./IntroSection";

import urls from "app/base/urls";
import type { RootState } from "app/store/root/types";
import {
  authState as authStateFactory,
  rootState as rootStateFactory,
  user as userFactory,
  userEventError as userEventErrorFactory,
  userState as userStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, renderWithMockStore } from "testing/utils";

describe("IntroSection", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      user: userStateFactory({
        auth: authStateFactory({
          user: userFactory({ completed_intro: false, is_superuser: true }),
        }),
      }),
    });
  });

  it("can display a loading spinner", () => {
    renderWithBrowserRouter(
      <IntroSection loading={true}>Intro content</IntroSection>,
      { route: "/intro/user", state }
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("can redirect to close the intro", () => {
    state.user = userStateFactory({
      auth: authStateFactory({
        user: userFactory({ completed_intro: true }),
      }),
    });
    const history = createMemoryHistory({
      initialEntries: [{ pathname: "/intro/user", key: "testKey" }],
    });
    renderWithMockStore(
      <Router history={history}>
        <CompatRouter>
          <IntroSection shouldExitIntro={true}>Intro content</IntroSection>
        </CompatRouter>
      </Router>,
      { state }
    );
    expect(history.location.pathname).toBe(urls.dashboard.index);
  });

  it("redirects to the dashboard for admins", () => {
    state.user = userStateFactory({
      auth: authStateFactory({
        user: userFactory({ completed_intro: true, is_superuser: true }),
      }),
    });
    renderWithBrowserRouter(
      <IntroSection shouldExitIntro={true}>Intro content</IntroSection>,
      { route: "/intro/user", state }
    );
    expect(window.location.pathname).toBe(urls.dashboard.index);
  });

  it("redirects to the machine list for non-admins", () => {
    state.user = userStateFactory({
      auth: authStateFactory({
        user: userFactory({ completed_intro: true, is_superuser: false }),
      }),
    });
    renderWithBrowserRouter(
      <IntroSection shouldExitIntro={true}>Intro content</IntroSection>,
      { route: "/intro/user", state }
    );
    expect(window.location.pathname).toBe(urls.machines.index);
  });

  it("can show errors", () => {
    state.user = userStateFactory({
      eventErrors: [userEventErrorFactory()],
    });
    renderWithBrowserRouter(
      <IntroSection errors="Uh oh!">Intro content</IntroSection>,
      { route: "/intro/user", state }
    );
    const title = screen.getByText("Error:");
    const message = screen.getByText("Uh oh!");
    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(title).toHaveClass("p-notification__title");
    expect(message).toHaveClass("p-notification__message");
  });
});

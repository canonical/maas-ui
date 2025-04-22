import IntroSection from "./IntroSection";

import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  screen,
  renderWithBrowserRouter,
  renderWithProviders,
} from "@/testing/utils";

describe("IntroSection", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      user: factory.userState({
        auth: factory.authState({
          user: factory.user({ completed_intro: false, is_superuser: true }),
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
    state.user = factory.userState({
      auth: factory.authState({
        user: factory.user({ completed_intro: true }),
      }),
    });
    const { router } = renderWithProviders(
      <IntroSection shouldExitIntro={true}>Intro content</IntroSection>,
      { state, initialEntries: ["/intro/user"] }
    );
    expect(router.state.location.pathname).toBe(urls.machines.index);
  });

  it("redirects to the machine list for admins", () => {
    state.user = factory.userState({
      auth: factory.authState({
        user: factory.user({ completed_intro: true, is_superuser: true }),
      }),
    });
    renderWithBrowserRouter(
      <IntroSection shouldExitIntro={true}>Intro content</IntroSection>,
      { route: "/intro/user", state }
    );
    expect(window.location.pathname).toBe(urls.machines.index);
  });

  it("redirects to the machine list for non-admins", () => {
    state.user = factory.userState({
      auth: factory.authState({
        user: factory.user({ completed_intro: true, is_superuser: false }),
      }),
    });
    renderWithBrowserRouter(
      <IntroSection shouldExitIntro={true}>Intro content</IntroSection>,
      { route: "/intro/user", state }
    );
    expect(window.location.pathname).toBe(urls.machines.index);
  });

  it("can show errors", () => {
    state.user = factory.userState({
      eventErrors: [factory.userEventError()],
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

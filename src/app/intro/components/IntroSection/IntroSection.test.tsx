import IntroSection from "./IntroSection";

import urls from "@/app/base/urls";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { screen, renderWithProviders, setupMockServer } from "@/testing/utils";

const mockServer = setupMockServer(authResolvers.getThisUser.handler());

describe("IntroSection", () => {
  it("can display a loading spinner", () => {
    renderWithProviders(
      <IntroSection loading={true}>Intro content</IntroSection>,
      { initialEntries: ["/intro/user"] }
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("can redirect to close the intro", () => {
    mockServer.use(
      authResolvers.getThisUser.handler(factory.user({ completed_intro: true }))
    );
    const { router } = renderWithProviders(
      <IntroSection shouldExitIntro={true}>Intro content</IntroSection>,
      { initialEntries: ["/intro/user"] }
    );
    expect(router.state.location.pathname).toBe(urls.machines.index);
  });

  it("redirects to the machine list for admins", () => {
    mockServer.use(
      authResolvers.getThisUser.handler(
        factory.user({ completed_intro: true, is_superuser: true })
      )
    );
    const { router } = renderWithProviders(
      <IntroSection shouldExitIntro={true}>Intro content</IntroSection>,
      { initialEntries: ["/intro/user"] }
    );
    expect(router.state.location.pathname).toBe(urls.machines.index);
  });

  it("redirects to the machine list for non-admins", () => {
    mockServer.use(
      authResolvers.getThisUser.handler(
        factory.user({ completed_intro: true, is_superuser: false })
      )
    );
    const { router } = renderWithProviders(
      <IntroSection shouldExitIntro={true}>Intro content</IntroSection>,
      { initialEntries: ["/intro/user"] }
    );
    expect(router.state.location.pathname).toBe(urls.machines.index);
  });

  it("can show errors", () => {
    renderWithProviders(
      <IntroSection errors="Uh oh!">Intro content</IntroSection>,
      { initialEntries: ["/intro/user"] }
    );
    const title = screen.getByText("Error:");
    const message = screen.getByText("Uh oh!");
    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(title).toHaveClass("p-notification__title");
    expect(message).toHaveClass("p-notification__message");
  });
});

import { waitFor } from "@testing-library/react";

import Intro from "./Intro";

import urls from "@/app/base/urls";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { screen, renderWithProviders, setupMockServer } from "@/testing/utils";

const mockServer = setupMockServer(authResolvers.getCurrentUser.handler());

describe("Intro", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        items: [{ name: ConfigNames.COMPLETED_INTRO, value: false }],
      }),
    });
  });

  it("displays a spinner when loading", () => {
    renderWithProviders(<Intro />, {
      initialEntries: ["/intro"],
      state,
    });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays a message if the user is not an admin", async () => {
    mockServer.use(
      authResolvers.getCurrentUser.handler(
        factory.user({ completed_intro: false, is_superuser: false })
      )
    );
    renderWithProviders(<Intro />, {
      initialEntries: ["/intro"],
      state,
    });
    await waitFor(() =>
      expect(
        screen.getByText(
          "This MAAS has not be configured. Ask an admin to log in and finish the configuration."
        )
      ).toBeInTheDocument()
    );
  });

  it("exits the intro if both intros have been completed", async () => {
    state.config = factory.configState({
      items: [{ name: ConfigNames.COMPLETED_INTRO, value: true }],
    });
    mockServer.use(
      authResolvers.getCurrentUser.handler(
        factory.user({ completed_intro: true, is_superuser: true })
      )
    );
    const { router } = renderWithProviders(<Intro />, {
      initialEntries: ["/intro"],
      state,
    });
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(urls.machines.index)
    );
  });

  it("returns to the start when loading the user intro and the main intro is incomplete", async () => {
    const { router } = renderWithProviders(<Intro />, {
      initialEntries: ["/intro"],
      state,
    });
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(urls.intro.index)
    );
  });

  it("skips to the user intro when loading the main intro when it is complete", async () => {
    state.config = factory.configState({
      items: [{ name: ConfigNames.COMPLETED_INTRO, value: true }],
    });
    mockServer.use(
      authResolvers.getCurrentUser.handler(
        factory.user({ completed_intro: false })
      )
    );
    const { router } = renderWithProviders(<Intro />, {
      initialEntries: ["/intro"],
      state,
    });
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(urls.intro.user)
    );
  });
});

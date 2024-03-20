import Intro from "./Intro";

import urls from "@/app/base/urls";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithBrowserRouter } from "@/testing/utils";

describe("Intro", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        items: [{ name: ConfigNames.COMPLETED_INTRO, value: false }],
      }),
      user: factory.userState({
        auth: factory.authState({
          user: factory.user({ completed_intro: false, is_superuser: true }),
        }),
      }),
    });
  });

  it("displays a spinner when loading", () => {
    state.user.auth.loading = true;
    renderWithBrowserRouter(<Intro />, {
      route: "/intro",
      state,
    });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays a message if the user is not an admin", () => {
    state.user = factory.userState({
      auth: factory.authState({
        user: factory.user({ completed_intro: false, is_superuser: false }),
      }),
    });
    renderWithBrowserRouter(<Intro />, {
      route: "/intro",
      state,
    });
    expect(
      screen.getByText(
        "This MAAS has not be configured. Ask an admin to log in and finish the configuration."
      )
    ).toBeInTheDocument();
  });

  it("exits the intro if both intros have been completed", () => {
    state.config = factory.configState({
      items: [{ name: ConfigNames.COMPLETED_INTRO, value: true }],
    });
    state.user = factory.userState({
      auth: factory.authState({
        user: factory.user({ completed_intro: true, is_superuser: true }),
      }),
    });
    renderWithBrowserRouter(<Intro />, {
      route: "/intro",
      state,
    });
    expect(window.location.pathname).toBe(urls.machines.index);
  });

  it("returns to the start when loading the user intro and the main intro is incomplete", () => {
    renderWithBrowserRouter(<Intro />, {
      route: "/intro",
      state,
    });
    expect(window.location.pathname).toBe(urls.intro.index);
  });

  it("skips to the user intro when loading the main intro when it is complete", () => {
    state.config = factory.configState({
      items: [{ name: ConfigNames.COMPLETED_INTRO, value: true }],
    });
    renderWithBrowserRouter(<Intro />, {
      route: "/intro",
      state,
    });
    expect(window.location.pathname).toBe(urls.intro.user);
  });
});

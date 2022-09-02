import { screen, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import ImagesIntro, { Labels as ImagesIntroLabels } from "./ImagesIntro";

import type { RootState } from "app/store/root/types";
import {
  bootResource as bootResourceFactory,
  bootResourceState as bootResourceStateFactory,
  bootResourceUbuntu as bootResourceUbuntuFactory,
  bootResourceUbuntuSource as bootResourceUbuntuSourceFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore();

describe("ImagesIntro", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [bootResourceFactory()],
        ubuntu: bootResourceUbuntuFactory(),
      }),
    });
  });

  it("displays a spinner if server has not been polled yet", () => {
    state.bootresource.ubuntu = null;
    renderWithBrowserRouter(<ImagesIntro />, {
      route: "/intro/images",
      wrapperProps: { state },
    });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("stops polling when unmounted", async () => {
    const store = mockStore(state);
    const { unmount } = render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/intro/images", key: "testKey" }]}
        >
          <CompatRouter>
            <ImagesIntro />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    unmount();

    expect(
      store
        .getActions()
        .some((action) => action.type === "bootresource/pollStop")
    ).toBe(true);
  });

  it("disables the continue button if no image and source has been configured", () => {
    state.bootresource.ubuntu = bootResourceUbuntuFactory({ sources: [] });
    state.bootresource.resources = [];
    renderWithBrowserRouter(<ImagesIntro />, {
      route: "/intro/images",
      wrapperProps: { state },
    });

    expect(
      screen.getByRole("button", { name: ImagesIntroLabels.Continue })
    ).toBeDisabled();
    expect(
      screen.getByRole("tooltip", { name: ImagesIntroLabels.CantContinue })
    ).toBeInTheDocument();
  });

  it("enables the continue button if an image and source has been configured", () => {
    state.bootresource.ubuntu = bootResourceUbuntuFactory({
      sources: [bootResourceUbuntuSourceFactory()],
    });
    state.bootresource.resources = [bootResourceFactory()];
    renderWithBrowserRouter(<ImagesIntro />, {
      route: "/intro/images",
      wrapperProps: { state },
    });

    expect(
      screen.getByRole("button", { name: ImagesIntroLabels.Continue })
    ).not.toBeDisabled();
  });
});

import configureStore from "redux-mock-store";

import ImagesIntro, { Labels as ImagesIntroLabels } from "./ImagesIntro";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  screen,
  expectTooltipOnHover,
  renderWithProviders,
} from "@/testing/utils";

const mockStore = configureStore();

describe("ImagesIntro", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [factory.bootResource()],
        ubuntu: factory.bootResourceUbuntu(),
      }),
    });
  });

  it("displays a spinner if server has not been polled yet", () => {
    state.bootresource.ubuntu = null;
    renderWithProviders(<ImagesIntro />, {
      state,
    });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("stops polling when unmounted", async () => {
    const store = mockStore(state);
    const { result } = renderWithProviders(<ImagesIntro />, { store });
    result.unmount();
    expect(
      store
        .getActions()
        .some((action) => action.type === "bootresource/pollStop")
    ).toBe(true);
  });

  it("disables the continue button if no image and source has been configured", async () => {
    state.bootresource.ubuntu = factory.bootResourceUbuntu({ sources: [] });
    state.bootresource.resources = [];
    renderWithProviders(<ImagesIntro />, {
      state,
    });

    const button = screen.getByRole("button", {
      name: ImagesIntroLabels.Continue,
    });
    expect(button).toBeAriaDisabled();

    await expectTooltipOnHover(button, ImagesIntroLabels.CantContinue);
  });

  it("enables the continue button if an image and source has been configured", () => {
    state.bootresource.ubuntu = factory.bootResourceUbuntu({
      sources: [factory.bootResourceUbuntuSource()],
    });
    state.bootresource.resources = [factory.bootResource()];
    renderWithProviders(<ImagesIntro />, {
      state,
    });
    expect(
      screen.getByRole("button", { name: ImagesIntroLabels.Continue })
    ).not.toBeAriaDisabled();
  });
});

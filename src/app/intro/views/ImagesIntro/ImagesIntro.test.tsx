import configureStore from "redux-mock-store";

import ImagesIntro, { Labels as ImagesIntroLabels } from "./ImagesIntro";

import type { RootState } from "@/app/store/root/types";
import { LONG_TIMEOUT } from "@/testing/constants";
import * as factory from "@/testing/factories";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
import { imageSourceResolvers } from "@/testing/resolvers/imageSources";
import {
  screen,
  expectTooltipOnHover,
  renderWithProviders,
  setupMockServer,
  waitForLoading,
} from "@/testing/utils";

const mockStore = configureStore();
const mockServer = setupMockServer(
  imageSourceResolvers.listImageSources.handler(),
  configurationsResolvers.getConfiguration.handler()
);

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
    mockServer.use(
      imageSourceResolvers.listImageSources.handler({ items: [], total: 0 })
    );
    state.bootresource.resources = [];
    renderWithProviders(<ImagesIntro />, {
      state,
    });
    await waitForLoading();
    const button = screen.getByRole("button", {
      name: ImagesIntroLabels.Continue,
    });
    expect(button).toBeAriaDisabled();

    await expectTooltipOnHover(button, ImagesIntroLabels.CantContinue);
  });

  it("enables the continue button if an image and source has been configured", async () => {
    state.bootresource.resources = [factory.bootResource()];
    renderWithProviders(<ImagesIntro />, {
      state,
    });
    await waitForLoading("Loading...", { timeout: LONG_TIMEOUT });
    const button = screen.getByRole("button", {
      name: ImagesIntroLabels.Continue,
    });
    expect(button).not.toBeAriaDisabled();
  });
});

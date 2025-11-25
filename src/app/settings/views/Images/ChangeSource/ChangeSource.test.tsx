import { describe } from "vitest";

import ChangeSource from "@/app/settings/views/Images/ChangeSource/ChangeSource";
import { ConfigNames } from "@/app/store/config/types";
import * as factory from "@/testing/factories";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
import { imageSourceResolvers } from "@/testing/resolvers/imageSources";
import {
  renderWithBrowserRouter,
  screen,
  setupMockServer,
  userEvent,
  waitForLoading,
} from "@/testing/utils";

setupMockServer(
  imageSourceResolvers.listImageSources.handler(),
  imageSourceResolvers.getImageSource.handler(),
  imageSourceResolvers.updateImageSource.handler(),
  configurationsResolvers.getConfiguration.handler({
    name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT,
    value: true,
  }),
  configurationsResolvers.setConfiguration.handler()
);

describe("ChangeSource", () => {
  it("dispatches an action to update config when changing the auto sync switch", async () => {
    renderWithBrowserRouter(<ChangeSource />);
    await waitForLoading();
    await userEvent
      .click(
        screen.getByRole("checkbox", { name: /Automatically sync images/i })
      )
      .then(async () => {
        await userEvent.click(screen.getByText("Save"));
      });

    expect(configurationsResolvers.setConfiguration.resolved).toBe(true);
  });

  it("disables the button to change source if resources are downloading", async () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [factory.bootResource({ downloading: true })],
      }),
    });
    renderWithBrowserRouter(<ChangeSource />, { state });
    await waitForLoading();
    expect(screen.getByRole("button", { name: "Save" })).toBeAriaDisabled();
    expect(
      screen.getByTestId("cannot-change-source-warning")
    ).toBeInTheDocument();
  });
});

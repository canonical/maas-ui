import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SyncedImages, { Labels as SyncedImagesLabels } from "./SyncedImages";

import { BootResourceSourceType } from "app/store/bootresource/types";
import {
  bootResource as bootResourceFactory,
  bootResourceState as bootResourceStateFactory,
  bootResourceUbuntuSource as sourceFactory,
  bootResourceUbuntu as ubuntuFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

describe("SyncedImages", () => {
  it("can render the form in a card", async () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        ubuntu: ubuntuFactory({
          sources: [
            sourceFactory({ source_type: BootResourceSourceType.MAAS_IO }),
          ],
        }),
      }),
    });
    renderWithBrowserRouter(<SyncedImages formInCard />, {
      wrapperProps: { state },
    });

    await userEvent.click(
      screen.getByRole("button", { name: SyncedImagesLabels.ChangeSource })
    );
    expect(screen.getByText("Choose source")).toBeInTheDocument();
  });

  it("renders the change source form and disables closing it if no sources are detected", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        ubuntu: ubuntuFactory({ sources: [] }),
      }),
    });
    renderWithBrowserRouter(<SyncedImages />, { wrapperProps: { state } });
    expect(screen.getByText("Choose source")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Cancel" })
    ).not.toBeInTheDocument();
  });

  it("renders the correct text for a single default source", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        ubuntu: ubuntuFactory({
          sources: [
            sourceFactory({ source_type: BootResourceSourceType.MAAS_IO }),
          ],
        }),
      }),
    });
    renderWithBrowserRouter(<SyncedImages />, { wrapperProps: { state } });
    const images_from = screen.getByText(SyncedImagesLabels.SyncedFrom);
    expect(within(images_from).getByText("maas.io")).toBeInTheDocument();
  });

  it("renders the correct text for a single custom source", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        ubuntu: ubuntuFactory({
          sources: [
            sourceFactory({
              source_type: BootResourceSourceType.CUSTOM,
              url: "www.url.com",
            }),
          ],
        }),
      }),
    });
    renderWithBrowserRouter(<SyncedImages />, { wrapperProps: { state } });
    const images_from = screen.getByText(SyncedImagesLabels.SyncedFrom);
    expect(within(images_from).getByText("www.url.com")).toBeInTheDocument();
  });

  it("renders the correct text for multiple sources", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        ubuntu: ubuntuFactory({ sources: [sourceFactory(), sourceFactory()] }),
      }),
    });
    renderWithBrowserRouter(<SyncedImages />, { wrapperProps: { state } });
    const images_from = screen.getByText(SyncedImagesLabels.SyncedFrom);
    expect(within(images_from).getByText("sources")).toBeInTheDocument();
  });

  it("disables the button to change source if resources are downloading", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        resources: [bootResourceFactory({ downloading: true })],
        ubuntu: ubuntuFactory({ sources: [sourceFactory()] }),
      }),
    });
    renderWithBrowserRouter(<SyncedImages />, { wrapperProps: { state } });
    expect(
      screen.getByRole("button", { name: SyncedImagesLabels.ChangeSource })
    ).toBeDisabled();
    expect(
      screen.getByRole("tooltip", {
        name: "Cannot change source while images are downloading.",
      })
    ).toBeInTheDocument();
  });
});

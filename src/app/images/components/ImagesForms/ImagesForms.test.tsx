import ImagesForms from "./ImagesForms";

import { ImageSidePanelViews } from "@/app/images/constants";
import type { ImageSidePanelContent } from "@/app/images/types";
import * as factory from "@/testing/factories";
import { renderWithProviders, screen } from "@/testing/utils";

describe("ImagesForms", () => {
  it("renders DeleteImage form", () => {
    const sidePanelContent: ImageSidePanelContent = {
      view: ImageSidePanelViews.DELETE_IMAGE,
      extras: { bootResource: factory.bootResource() },
    };
    renderWithProviders(
      <ImagesForms
        setSidePanelContent={vi.fn()}
        sidePanelContent={sidePanelContent}
      />
    );

    expect(
      screen.getByRole("form", { name: "Confirm image deletion" })
    ).toBeInTheDocument();
  });

  it("renders DeleteMultipleImages form", () => {
    const sidePanelContent: ImageSidePanelContent = {
      view: ImageSidePanelViews.DELETE_MULTIPLE_IMAGES,
      extras: {
        rowSelection: { 1: true },
        setRowSelection: vi.fn,
      },
    };
    renderWithProviders(
      <ImagesForms
        setSidePanelContent={vi.fn()}
        sidePanelContent={sidePanelContent}
      />
    );

    expect(
      screen.getByRole("form", { name: "Confirm image deletion" })
    ).toBeInTheDocument();
  });

  it("renders DownloadImages form", () => {
    const sidePanelContent: ImageSidePanelContent = {
      view: ImageSidePanelViews.DOWNLOAD_IMAGE,
    };
    renderWithProviders(
      <ImagesForms
        setSidePanelContent={vi.fn()}
        sidePanelContent={sidePanelContent}
      />
    );

    expect(
      screen.getByText(
        "Select images to be imported and kept in sync daily. Images will be available for deployment on MAAS managed machines."
      )
    ).toBeInTheDocument();
  });
});

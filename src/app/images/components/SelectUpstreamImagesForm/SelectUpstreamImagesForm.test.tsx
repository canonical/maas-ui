import SelectUpstreamImagesForm from "./SelectUpstreamImagesForm";

import * as factory from "@/testing/factories";
import { imageSourceResolvers } from "@/testing/resolvers/imageSources";
import { imageResolvers } from "@/testing/resolvers/images";
import {
  userEvent,
  screen,
  within,
  renderWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  imageSourceResolvers.listImageSources.handler(),
  imageResolvers.listSelections.handler(),
  imageResolvers.listAvailableSelections.handler(),
  imageResolvers.addSelections.handler()
);

describe("SelectUpstreamImagesForm", () => {
  it("correctly filters selection options", async () => {
    renderWithProviders(<SelectUpstreamImagesForm />);
    await waitFor(() => {
      expect(
        screen.getByRole("row", {
          name: "noble",
          hidden: true,
        })
      ).toBeInTheDocument();
    });

    const rowAvailable = within(
      screen.getByRole("row", {
        name: "noble",
        hidden: true,
      })
    ).getAllByRole("combobox", { hidden: true });
    expect(rowAvailable).toHaveLength(1);
    await userEvent.click(rowAvailable[0]);
    expect(screen.getByText("arm64")).toBeInTheDocument();
    expect(screen.queryByText("amd64")).not.toBeInTheDocument();
  });

  it("can dispatch an action to save ubuntu images", async () => {
    renderWithProviders(<SelectUpstreamImagesForm />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Save and sync" })
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getByRole("button", { name: "Save and sync" })
    );
    await waitFor(() => {
      expect(imageResolvers.addSelections.resolved).toBeTruthy();
    });
  });

  it("disables form with a notification if more than one source detected", async () => {
    mockServer.use(
      imageSourceResolvers.listImageSources.handler({
        items: [
          factory.imageSourceFactory.build(),
          factory.imageSourceFactory.build(),
        ],
        total: 2,
      })
    );

    renderWithProviders(<SelectUpstreamImagesForm />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "More than one image source exists. The UI does not support updating synced images when more than one source has been defined. Use the API to adjust your sources."
        )
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText(
        "More than one image source exists. The UI does not support updating synced images when more than one source has been defined. Use the API to adjust your sources."
      )
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Download" })
    ).not.toBeInTheDocument();
  });
});

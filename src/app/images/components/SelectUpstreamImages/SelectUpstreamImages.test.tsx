import SelectUpstreamImages from "./SelectUpstreamImages";

import { imageSourceFactory } from "@/testing/factories";
import { imageSourceResolvers } from "@/testing/resolvers/imageSources";
import { imageResolvers } from "@/testing/resolvers/images";
import {
  renderWithProviders,
  screen,
  userEvent,
  waitFor,
  within,
  setupMockServer,
} from "@/testing/utils";

setupMockServer(
  imageResolvers.listSelections.handler(),
  imageResolvers.listAvailableSelections.handler(),
  imageResolvers.addSelections.handler(),
  imageSourceResolvers.listImageSources.handler({
    items: [
      imageSourceFactory.build({
        id: 1,
        url: "http://images.maas.io/ephemeral-v3/stable/",
        priority: 2,
      }),
      imageSourceFactory.build({
        id: 2,
        url: "http://images.maas.io/ephemeral-v3/candidate/",
        priority: 1,
      }),
    ],
    total: 1,
  })
);

describe("SelectUpstreamImages", () => {
  it("renders the stepper with all step labels", () => {
    renderWithProviders(<SelectUpstreamImages />);
    expect(screen.getByText("Image selection")).toBeInTheDocument();
    expect(screen.getByText("Source configuration")).toBeInTheDocument();
  });

  it("shows the image selection form on the initial step", async () => {
    renderWithProviders(<SelectUpstreamImages />);
    await waitFor(() => {
      expect(
        screen.getByRole("form", { name: "Select upstream images to sync" })
      ).toBeInTheDocument();
    });
  });

  it("advances to the source configuration step when Next is clicked after selecting an image, and selects the higher-priority as the source", async () => {
    renderWithProviders(<SelectUpstreamImages />);
    await waitFor(() => {
      expect(
        screen.getByRole("row", { name: "24.04 LTS noble", hidden: true })
      ).toBeInTheDocument();
    });

    const comboboxes = within(
      screen.getByRole("row", { name: "24.04 LTS noble", hidden: true })
    ).getAllByRole("combobox", { hidden: true });

    await userEvent.click(comboboxes[0]);
    await userEvent.click(screen.getByRole("checkbox", { name: "arm64" }));
    await userEvent.click(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(
        screen.getByRole("form", { name: "Select upstream images sources" })
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: "MAAS Stable" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "MAAS Candidate" })
    ).not.toBeInTheDocument();
  });
});

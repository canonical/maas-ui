import SelectUpstreamImages from "./SelectUpstreamImages";

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
  imageSourceResolvers.listImageSources.handler()
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

  it("advances to the source configuration step when Next is clicked after selecting an image", async () => {
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
  });
});

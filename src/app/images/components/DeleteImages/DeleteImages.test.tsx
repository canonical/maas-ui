import DeleteImages from "./DeleteImages";

import { ConfigNames } from "@/app/store/config/types";
import { imageFactory } from "@/testing/factories";
import { configurationsResolvers } from "@/testing/resolvers/configurations";
import { imageResolvers } from "@/testing/resolvers/images";
import {
  userEvent,
  screen,
  mockSidePanel,
  renderWithProviders,
  setupMockServer,
  waitForLoading,
  waitFor,
  within,
} from "@/testing/utils";

const { mockClose } = await mockSidePanel();
const mockServer = setupMockServer(
  imageResolvers.listSelections.handler(),
  imageResolvers.listCustomImages.handler({
    items: [
      imageFactory.build({
        os: "customos",
        release: "customos",
        title: "1.0",
        boot_source_id: undefined,
      }),
    ],
    total: 1,
  }),
  imageResolvers.listSelectionStatuses.handler(),
  imageResolvers.listCustomImageStatuses.handler(),
  imageResolvers.listSelectionStatistics.handler(),
  imageResolvers.listCustomImageStatistics.handler(),
  imageResolvers.deleteSelections.handler(),
  imageResolvers.deleteCustomImages.handler(),
  configurationsResolvers.getConfiguration.handler({
    name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
    value: "noble",
  })
);

describe("DeleteImages", () => {
  it("displays commissioning release warning and affected image summary", async () => {
    renderWithProviders(
      <DeleteImages
        rowSelection={{ "1-selection": true, "4-custom": true }}
        setRowSelection={vi.fn}
      />
    );
    await waitForLoading();
    await waitFor(() => {
      expect(screen.getByText(/Deleting default commissioning release image/i));
    });

    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBe(2);
    expect(
      within(listItems[0]).getByLabelText("Default commissioning release")
    ).toBeInTheDocument();
    expect(
      within(listItems[1]).queryByLabelText("Default commissioning release")
    ).not.toBeInTheDocument();
  });

  it("calls closeForm on cancel click", async () => {
    renderWithProviders(
      <DeleteImages rowSelection={{}} setRowSelection={vi.fn} />
    );
    await waitForLoading();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockClose).toHaveBeenCalled();
  });

  it("calls delete images on save click", async () => {
    renderWithProviders(
      <DeleteImages
        rowSelection={{ "1-selection": true, "4-custom": true }}
        setRowSelection={vi.fn}
      />
    );
    await waitForLoading();
    await userEvent.click(screen.getByRole("button", { name: /Delete/i }));
    await waitFor(() => {
      expect(imageResolvers.deleteSelections.resolved).toBeTruthy();
    });
    await waitFor(() => {
      expect(imageResolvers.deleteCustomImages.resolved).toBeTruthy();
    });
  });

  it("displays error messages when delete image fails", async () => {
    mockServer.use(
      imageResolvers.deleteSelections.error({ code: 400, message: "Uh oh!" })
    );
    renderWithProviders(
      <DeleteImages
        rowSelection={{ "1-selection": true }}
        setRowSelection={vi.fn}
      />
    );
    await waitForLoading();
    await userEvent.click(
      screen.getByRole("button", { name: "Delete 1 image" })
    );
    await waitFor(() => {
      expect(screen.getByText(/Uh oh!/i)).toBeInTheDocument();
    });
  });
});

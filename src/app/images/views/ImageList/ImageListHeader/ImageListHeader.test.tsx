import { vi } from "vitest";

import ImageListHeader from "./ImageListHeader";

import DeleteImages from "@/app/images/components/DeleteImages";
import SelectUpstreamImages from "@/app/images/components/SelectUpstreamImages";
import UploadCustomImage from "@/app/images/components/UploadCustomImage";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { imageSourceResolvers } from "@/testing/resolvers/imageSources";
import { imageResolvers } from "@/testing/resolvers/images";
import {
  userEvent,
  screen,
  within,
  renderWithProviders,
  mockSidePanel,
  setupMockServer,
  waitFor,
  waitForLoading,
} from "@/testing/utils";

const { mockOpen } = await mockSidePanel();
const mockServer = setupMockServer(
  imageSourceResolvers.listImageSources.handler(),
  imageResolvers.listSelectionStatuses.handler(),
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);

describe("ImageListHeader", () => {
  it("sets loading state when polling", async () => {
    renderWithProviders(
      <ImageListHeader selectedRows={{}} setSelectedRows={vi.fn} />
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the correct text for a single default source", async () => {
    renderWithProviders(
      <ImageListHeader selectedRows={{}} setSelectedRows={() => {}} />
    );
    await waitForLoading();
    const images_from = screen.getByText("Images synced from");
    expect(within(images_from).getByText("maas.io")).toBeInTheDocument();
  });

  it("renders the correct text for a single custom source", async () => {
    mockServer.use(
      imageSourceResolvers.listImageSources.handler({
        items: [factory.imageSourceFactory.build({ url: "www.url.com" })],
        total: 1,
      })
    );
    renderWithProviders(
      <ImageListHeader selectedRows={{}} setSelectedRows={() => {}} />
    );
    await waitForLoading();
    const images_from = screen.getByText("Images synced from");
    expect(within(images_from).getByText("www.url.com")).toBeInTheDocument();
  });

  it("renders the correct text for multiple sources", async () => {
    mockServer.use(
      imageSourceResolvers.listImageSources.handler({
        items: [
          factory.imageSourceFactory.build(),
          factory.imageSourceFactory.build(),
        ],
        total: 2,
      })
    );
    renderWithProviders(
      <ImageListHeader selectedRows={{}} setSelectedRows={() => {}} />
    );
    await waitForLoading();
    const images_from = screen.getByText("Images synced from");
    expect(
      within(images_from).getByText("multiple sources")
    ).toBeInTheDocument();
  });
});

describe("Select upstream images", () => {
  it("can trigger select upstream images side panel form", async () => {
    renderWithProviders(
      <ImageListHeader selectedRows={{}} setSelectedRows={() => {}} />
    );
    await waitForLoading();
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Select upstream images" })
      ).not.toBeAriaDisabled();
    });
    await userEvent.click(
      screen.getByRole("button", { name: "Select upstream images" })
    );

    expect(mockOpen).toHaveBeenCalledWith({
      component: SelectUpstreamImages,
      title: "Select upstream images to sync",
    });
  });
});

describe("Delete", () => {
  it("disables the button to delete images if no rows are selected", async () => {
    renderWithProviders(
      <ImageListHeader selectedRows={{}} setSelectedRows={() => {}} />
    );
    await waitForLoading();
    expect(screen.getByRole("button", { name: "Delete" })).toBeAriaDisabled();
  });

  it("can trigger delete images side panel form", async () => {
    renderWithProviders(
      <ImageListHeader selectedRows={{ 1: true }} setSelectedRows={vi.fn} />
    );
    await waitForLoading();
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Delete" })
      ).not.toBeAriaDisabled();
    });
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(mockOpen).toHaveBeenCalledWith({
      component: DeleteImages,
      props: {
        rowSelection: { 1: true },
        setRowSelection: expect.any(Function),
      },
      title: "Delete image",
    });
  });
});

describe("permissions", () => {
  it("disables all header actions without the edit entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(
      <ImageListHeader selectedRows={{ 1: true }} setSelectedRows={vi.fn} />
    );
    await waitForLoading();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Delete" })).toBeAriaDisabled();
    });
    expect(
      screen.getByRole("button", { name: "Upload custom image" })
    ).toBeAriaDisabled();
    expect(
      screen.getByRole("button", { name: "Select upstream images" })
    ).toBeAriaDisabled();

    await userEvent.click(
      screen.getByRole("button", { name: "Upload custom image" })
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Select upstream images" })
    );
    expect(mockOpen).not.toHaveBeenCalled();
  });

  it("enables the upload and select buttons with the edit entitlement", async () => {
    renderWithProviders(
      <ImageListHeader selectedRows={{}} setSelectedRows={vi.fn} />
    );
    await waitForLoading();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Upload custom image" })
      ).not.toBeAriaDisabled();
    });
    expect(
      screen.getByRole("button", { name: "Select upstream images" })
    ).not.toBeAriaDisabled();
  });

  it("can trigger the upload custom image side panel form", async () => {
    renderWithProviders(
      <ImageListHeader selectedRows={{}} setSelectedRows={vi.fn} />
    );
    await waitForLoading();
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Upload custom image" })
      ).not.toBeAriaDisabled();
    });
    await userEvent.click(
      screen.getByRole("button", { name: "Upload custom image" })
    );

    expect(mockOpen).toHaveBeenCalledWith({
      component: UploadCustomImage,
      title: "Upload custom image",
    });
  });
});

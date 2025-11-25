import {
  useGetImageSource,
  useImageSources,
  useUpdateImageSource,
} from "./imageSources";

import type { BootSourceRequest } from "@/app/apiclient";
import {
  imageSourceResolvers,
  mockImageSources,
} from "@/testing/resolvers/imageSources";
import {
  renderHookWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(
  imageSourceResolvers.listImageSources.handler(),
  imageSourceResolvers.getImageSource.handler(),
  imageSourceResolvers.updateImageSource.handler()
);

describe("useImageSources", () => {
  it("should return image sources data", async () => {
    const { result } = renderHookWithProviders(() => useImageSources());
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.items).toEqual(mockImageSources.items);
  });
});

describe("useGetImageSource", () => {
  it("should return the correct image source", async () => {
    const expectedImageSource = mockImageSources.items[0];
    const { result } = renderHookWithProviders(() =>
      useGetImageSource(
        { path: { boot_source_id: expectedImageSource.id } },
        true
      )
    );
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toMatchObject(expectedImageSource);
  });

  it("should return error if image source does not exist", async () => {
    const { result } = renderHookWithProviders(() =>
      useGetImageSource({ path: { boot_source_id: 99 } }, true)
    );
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it("should not fetch when enabled is false", async () => {
    const { result } = renderHookWithProviders(() =>
      useGetImageSource({ path: { boot_source_id: 1 } }, false)
    );
    // Wait a bit to ensure the query doesn't start
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });
});

describe("useUpdateImageSource", () => {
  it("should update an existing image source", async () => {
    const updatedImageSource: BootSourceRequest = {
      url: "http://updated.images.io/",
      keyring_filename: "/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg",
      keyring_data: "newdata",
      priority: 5,
      skip_keyring_verification: false,
    };
    const { result } = renderHookWithProviders(() => useUpdateImageSource());
    result.current.mutate({
      body: updatedImageSource,
      path: { boot_source_id: 1 },
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});

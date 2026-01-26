import { sha256 } from "js-sha256";

import {
  useAddSelections,
  useAvailableSelections,
  useCustomImages,
  useCustomImageStatistics,
  useCustomImageStatuses,
  useDeleteCustomImages,
  useDeleteSelections,
  useImages,
  useSelections,
  useSelectionStatistics,
  useSelectionStatuses,
  useUploadCustomImage,
} from "@/app/api/query/images";
import { getFileExtension } from "@/app/images/components/UploadCustomImage/UploadCustomImage";
import {
  imageResolvers,
  mockAvailableSelections,
  mockSelections,
  mockStatistics,
  mockStatuses,
} from "@/testing/resolvers/images";
import {
  renderHookWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(
  imageResolvers.listSelections.handler(),
  imageResolvers.listSelectionStatuses.handler(),
  imageResolvers.listSelectionStatistics.handler(),
  imageResolvers.listCustomImages.handler(),
  imageResolvers.listCustomImageStatuses.handler(),
  imageResolvers.listCustomImageStatistics.handler(),
  imageResolvers.listAvailableSelections.handler(),
  imageResolvers.addSelections.handler(),
  imageResolvers.deleteSelections.handler(),
  imageResolvers.uploadCustomImage.handler(),
  imageResolvers.deleteCustomImages.handler()
);

describe("useImages", () => {
  it("should return merged image data", async () => {
    const { result } = renderHookWithProviders(() => useImages());
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    const expectedItems = mockSelections.items.map((item, index) => {
      return {
        ...item,
        ...mockStatistics.items[index],
        ...mockStatuses.items[index],
        id: `${item.id}-selection`,
        isUpstream: true,
      };
    });
    expect(result.current.data?.items).toEqual(expectedItems);
    expect(result.current.stages).not.toBe(undefined);
  });
});

describe("useSelections", () => {
  it("should return selection data", async () => {
    const { result } = renderHookWithProviders(() => useSelections());
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.items).toEqual(mockSelections.items);
  });
});

describe("useSelectionStatuses", () => {
  it("should return selection status data", async () => {
    const { result } = renderHookWithProviders(() => useSelectionStatuses());
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.items).toEqual(mockStatuses.items);
  });
});

describe("useSelectionStatistics", () => {
  it("should return selection statistics data", async () => {
    const { result } = renderHookWithProviders(() => useSelectionStatistics());
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.items).toEqual(mockStatistics.items);
  });
});

describe("useCustomImages", () => {
  it("should return custom image data", async () => {
    const { result } = renderHookWithProviders(() => useCustomImages());
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});

describe("useSelectionStatuses", () => {
  it("should return custom image status data", async () => {
    const { result } = renderHookWithProviders(() => useCustomImageStatuses());
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});

describe("useSelectionStatistics", () => {
  it("should return custom image statistics data", async () => {
    const { result } = renderHookWithProviders(() =>
      useCustomImageStatistics()
    );
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});

describe("useAvailableSelections", () => {
  it("should return available selection data", async () => {
    const { result } = renderHookWithProviders(() => useAvailableSelections());
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.items).toEqual(mockAvailableSelections.items);
  });
});

describe("useAddSelections", () => {
  it("should add a new selection", async () => {
    const { result } = renderHookWithProviders(() => useAddSelections());
    result.current.mutate({
      body: [
        {
          os: "ubuntu",
          release: "noble",
          arch: "amd64",
          boot_source_id: 0,
        },
      ],
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});

describe("useDeleteSelections", () => {
  it("should delete a selection", async () => {
    const { result } = renderHookWithProviders(() => useDeleteSelections());
    result.current.mutate({
      query: {
        id: [1],
      },
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});

describe("useUploadCustomImage", () => {
  it("should add a new custom image", async () => {
    const { result } = renderHookWithProviders(() => useUploadCustomImage());
    const dummyContent = "dummy content";
    const contentArray = new TextEncoder().encode(dummyContent);

    const dummyFile = new File([dummyContent], "test-image.tgz", {
      type: "application/octet-stream",
    });

    result.current.mutate({
      body: dummyFile,
      headers: {
        "Content-Type": "multipart/form-data",
        name: `ubuntu/noble`,
        // the dummy file cannot be used with the getChecksumSha256
        // function actually used in UploadCustomImage
        sha256: sha256(contentArray),
        size: dummyFile.size,
        architecture: `amd64/generic`,
        "file-type": getFileExtension(dummyFile.name),
        title: "24.04",
        "base-image": undefined,
      },
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});

describe("useDeleteCustomImages", () => {
  it("should delete a custom image", async () => {
    const { result } = renderHookWithProviders(() => useDeleteCustomImages());
    result.current.mutate({
      query: {
        id: [1],
      },
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});

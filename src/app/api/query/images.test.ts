import {
  useAddSelections,
  useAvailableSelections,
  useCustomImages,
  useCustomImageStatistics,
  useCustomImageStatuses,
  useDeleteSelections,
  useImages,
  useSelections,
  useSelectionStatistics,
  useSelectionStatuses,
} from "@/app/api/query/images";
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
  imageResolvers.deleteSelections.handler()
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

import { useStartImageSync, useStopImageSync } from "@/app/api/query/imageSync";
import { renderHookWithProviders, waitFor } from "@/testing/utils";

describe("useStartImageSync", () => {
  it("should start image sync", async () => {
    const { result } = renderHookWithProviders(() => useStartImageSync());
    result.current.mutate({
      path: {
        boot_source_id: 0,
        id: 0,
      },
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});

describe("useStopImageSync", () => {
  it("should stop image sync", async () => {
    const { result } = renderHookWithProviders(() => useStopImageSync());
    result.current.mutate({
      path: {
        boot_source_id: 0,
        id: 0,
      },
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});

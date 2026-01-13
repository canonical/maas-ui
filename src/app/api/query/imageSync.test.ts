import { useStartImageSync, useStopImageSync } from "@/app/api/query/imageSync";
import { ACTIVE_DOWNLOAD_REFETCH_INTERVAL } from "@/app/api/query/images";
import * as sdk from "@/app/apiclient/sdk.gen";
import { imageStatusFactory } from "@/testing/factories";
import { imageSyncResolvers } from "@/testing/resolvers/imageSync";
import { imageResolvers } from "@/testing/resolvers/images";
import {
  renderHookWithProviders,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

setupMockServer(
  imageResolvers.listSelectionStatuses.handler(),
  imageResolvers.listCustomImageStatuses.handler(),
  imageSyncResolvers.startSynchronization.handler(),
  imageSyncResolvers.stopSynchronization.handler()
);

describe("useStartImageSync", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts image sync and stops polling when backend returns `Downloading`", async () => {
    const listSelectionStatusSpy = vi
      .spyOn(sdk, "listSelectionStatus")
      .mockResolvedValueOnce(
        // @ts-expect-error partial return
        {
          data: {
            items: [
              imageStatusFactory.build({
                id: 0,
                status: "Waiting for download",
              }),
            ],
            total: 1,
          },
        }
      )
      .mockResolvedValueOnce(
        // @ts-expect-error partial return
        {
          data: {
            items: [imageStatusFactory.build({ id: 0, status: "Downloading" })],
            total: 1,
          },
        }
      );

    const { result } = renderHookWithProviders(() => useStartImageSync());

    result.current.mutate({
      path: { boot_source_id: 0, id: 0 },
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    await vi.advanceTimersByTimeAsync(ACTIVE_DOWNLOAD_REFETCH_INTERVAL / 2);
    expect(listSelectionStatusSpy).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(ACTIVE_DOWNLOAD_REFETCH_INTERVAL);
    expect(listSelectionStatusSpy).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(ACTIVE_DOWNLOAD_REFETCH_INTERVAL);
    expect(listSelectionStatusSpy).toHaveBeenCalledTimes(2);
  });

  it("extends polling on additional sync starts and stops when all images return `Downloading`", async () => {
    const listSelectionStatusSpy = vi
      .spyOn(sdk, "listSelectionStatus")
      .mockResolvedValueOnce(
        // @ts-expect-error partial return
        {
          data: {
            items: [
              imageStatusFactory.build({
                id: 0,
                status: "Waiting for download",
              }),
              imageStatusFactory.build({
                id: 1,
                status: "Waiting for download",
              }),
            ],
            total: 1,
          },
        }
      )
      .mockResolvedValueOnce(
        // @ts-expect-error partial return
        {
          data: {
            items: [
              imageStatusFactory.build({ id: 0, status: "Downloading" }),
              imageStatusFactory.build({
                id: 1,
                status: "Waiting for download",
              }),
            ],
            total: 1,
          },
        }
      )
      .mockResolvedValueOnce(
        // @ts-expect-error partial return
        {
          data: {
            items: [
              imageStatusFactory.build({ id: 0, status: "Downloading" }),
              imageStatusFactory.build({
                id: 1,
                status: "Downloading",
              }),
            ],
            total: 1,
          },
        }
      );

    const { result } = renderHookWithProviders(() => useStartImageSync());

    result.current.mutate({
      path: { boot_source_id: 0, id: 0 },
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    await vi.advanceTimersByTimeAsync(ACTIVE_DOWNLOAD_REFETCH_INTERVAL / 2);
    expect(listSelectionStatusSpy).toHaveBeenCalledTimes(1);

    result.current.mutate({
      path: { boot_source_id: 0, id: 1 },
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    await vi.advanceTimersByTimeAsync(ACTIVE_DOWNLOAD_REFETCH_INTERVAL);
    expect(listSelectionStatusSpy).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(ACTIVE_DOWNLOAD_REFETCH_INTERVAL);
    expect(listSelectionStatusSpy).toHaveBeenCalledTimes(3);
    await vi.advanceTimersByTimeAsync(ACTIVE_DOWNLOAD_REFETCH_INTERVAL);
    expect(listSelectionStatusSpy).toHaveBeenCalledTimes(3);
  });
});

describe("useStopImageSync", () => {
  it("stops image sync", async () => {
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

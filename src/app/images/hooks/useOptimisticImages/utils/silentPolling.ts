import type { QueryClient } from "@tanstack/react-query";

import { withImagesWorkflow } from "@/app/api/query/images";
import { listSelectionStatus } from "@/app/apiclient";
import {
  listSelectionStatisticQueryKey,
  listSelectionStatusQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const POLL_INTERVAL = 5000;
const MAX_ATTEMPTS_PER_IMAGE = 10;

type PollEntry = {
  attempts: number;
  action: "start" | "stop";
};

type SilentPollState = {
  active: boolean;
  entries: Map<number, PollEntry>;
  timer: ReturnType<typeof setTimeout> | null;
};

export const silentPoll: SilentPollState = {
  active: false,
  entries: new Map(),
  timer: null,
};

/**
 * Starts a silent polling mechanism to check if optimistically updated images
 * have transitioned to "Downloading" state on the backend.
 *
 * This function is called after starting image sync to verify that the backend
 * has picked up the sync request. It polls the backend at regular intervals
 * without triggering UI refetches, checking each tracked image's status.
 *
 * The polling continues until:
 * - An image's status becomes "Downloading" (success)
 * - An image reaches MAX_ATTEMPTS_PER_IMAGE (timeout/failure)
 * - All tracked images are resolved
 *
 * Once all images are resolved, it invalidates queries to refresh the UI
 * and stops the polling mechanism.
 *
 * @param queryClient - The React Query client for managing query cache
 */
export const startOrExtendSilentPolling = (queryClient: QueryClient) => {
  // Prevent multiple concurrent polling loops
  if (silentPoll.active) {
    return;
  }

  silentPoll.active = true;

  const poll = async () => {
    try {
      // Fetch latest status from backend without triggering UI updates
      const [selectionResult] = await Promise.all([listSelectionStatus()]);

      const selectionItems = selectionResult?.data?.items ?? [];

      // Check each tracked image to see if it has resolved
      for (const [imageId, entry] of silentPoll.entries) {
        entry.attempts++;

        // Find the image's current status from backend
        const backendSyncStatus = selectionItems.find(
          (i) => i.id === imageId
        )?.status;

        const backendUpdateStatus = selectionItems.find(
          (i) => i.id === imageId
        )?.update_status;

        // Determine if image is resolved based on action type
        let resolved = false;

        if (entry.action === "start") {
          // For start action: resolved when status becomes "Downloading"
          resolved =
            backendSyncStatus === "Downloading" ||
            backendUpdateStatus === "Downloading" ||
            entry.attempts >= MAX_ATTEMPTS_PER_IMAGE;
        } else if (entry.action === "stop") {
          // For stop action: resolved when status is NOT "Downloading"
          resolved =
            (backendSyncStatus !== "Downloading" &&
              backendUpdateStatus !== "Downloading") ||
            entry.attempts >= MAX_ATTEMPTS_PER_IMAGE;
        }

        if (resolved) {
          silentPoll.entries.delete(imageId);
        }
      }
    } catch {
      // Failed poll is treated as "condition not met yet"
      // Increment attempts and check for timeout on all tracked images
      for (const [imageId, entry] of silentPoll.entries) {
        entry.attempts++;

        if (entry.attempts >= MAX_ATTEMPTS_PER_IMAGE) {
          silentPoll.entries.delete(imageId);
        }
      }
    }

    // All images resolved - stop polling and refresh UI
    if (silentPoll.entries.size === 0) {
      silentPoll.active = false;
      silentPoll.timer = null;

      // Invalidate all image-related queries to show final state
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: withImagesWorkflow(listSelectionStatusQueryKey()),
        }),
        queryClient.invalidateQueries({
          queryKey: withImagesWorkflow(listSelectionStatisticQueryKey()),
        }),
      ]);

      return;
    }

    // Continue polling - schedule next check
    silentPoll.timer = setTimeout(poll, POLL_INTERVAL);
  };

  // Start first poll after half interval to give backend a head-start
  silentPoll.timer = setTimeout(poll, POLL_INTERVAL / 2);
};

export const resetSilentPolling = () => {
  if (silentPoll.timer) {
    clearTimeout(silentPoll.timer);
  }

  silentPoll.entries.clear();
  silentPoll.active = false;
  silentPoll.timer = null;
};

let activeHookCount = 0;

export const registerPollingHook = () => {
  activeHookCount++;
  return () => {
    activeHookCount--;
    // Only cleanup when no hooks are active
    if (activeHookCount === 0 && silentPoll.entries.size === 0) {
      resetSilentPolling();
    }
  };
};

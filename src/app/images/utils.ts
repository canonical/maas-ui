import type {
  BootSourceResponse,
  UiSourceAvailableImageResponse,
} from "@/app/apiclient";
import { OPERATING_SYSTEM_NAMES } from "@/app/images/constants";

export const capitalizeOs = (os: string): string =>
  os.charAt(0).toUpperCase() + os.slice(1);

export const getOsDisplayName = (os: string): string =>
  OPERATING_SYSTEM_NAMES.find(
    (entry) => entry.value.toLowerCase() === os.toLowerCase()
  )?.label ?? capitalizeOs(os);

/**
 * Builds a lookup map of "os/release/architecture" → deduplicated source array.
 *
 * An optional `filterKeys` Set restricts the result to only those image keys
 * that are present in the set, allowing callers to scope the map to a subset
 * of images (e.g. only already-selected images in the confirmation step).
 */
export const buildSourcesByImageKey = (
  sources: BootSourceResponse[],
  availableImages: UiSourceAvailableImageResponse[],
  filterKeys?: Set<string>
): Record<string, BootSourceResponse[]> => {
  const map: Record<string, BootSourceResponse[]> = {};
  for (const img of availableImages) {
    const key = `${img.os}/${img.release}/${img.architecture}`;
    if (filterKeys && !filterKeys.has(key)) continue;
    const source = sources.find((s) => s.id === img.source_id);
    if (!source) continue;
    if (!map[key]) {
      map[key] = [source];
    } else if (!map[key].some((s) => s.id === source.id)) {
      map[key].push(source);
    }
  }
  return map;
};

import { useParams } from "react-router";

import type { RouteParams } from "../types";

import { parseNumberId } from "app/utils";

/**
 * Get the id param from the URL and convert to the right type.
 * @param pk - The model id key.
 */
export function useGetURLId(pk: "system_id"): string | null;
export function useGetURLId(pk: "id"): number | null;
export function useGetURLId(pk: "id" | "system_id"): string | number | null {
  const { id } = useParams<RouteParams>();
  if (pk === "system_id") {
    return id || null;
  }
  return parseNumberId(id);
}

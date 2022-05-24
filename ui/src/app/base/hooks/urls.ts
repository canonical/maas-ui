import { useMemo } from "react";

import { useParams, useLocation } from "react-router-dom-v5-compat";

import { parseNumberId } from "app/utils";

/**
 * Get the id param from the URL and convert to the right type.
 * @param pk - The model id key.
 */
export function useGetURLId(pk: "system_id", key?: string): string | null;
export function useGetURLId(pk: "id", key?: string): number | null;
export function useGetURLId(
  pk: "id" | "system_id",
  key?: string
): string | number | null {
  const params = useParams<string>();
  const id = params[key || "id"];
  if (pk === "system_id") {
    return id || null;
  }
  return parseNumberId(id);
}

export const useQuery = (): URLSearchParams => {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
};

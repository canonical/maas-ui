import { useMemo } from "react";

import type { UseQueryResult } from "@tanstack/react-query";

type QueryHook<T> = () => UseQueryResult<T[], unknown>;

export const useItemsCount = <T>(useItems: QueryHook<T>) => {
  const { data } = useItems();
  return useMemo(() => data?.length ?? 0, [data]);
};

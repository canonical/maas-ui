import { QueryClient } from "@tanstack/react-query";

export const queryKeys = {
  zones: {
    list: ["zones"],
  },
} as const;

type QueryKeys = typeof queryKeys;
type QueryKeyCategories = keyof QueryKeys;
type QueryKeySubcategories<T extends QueryKeyCategories> = keyof QueryKeys[T];

export type QueryKey =
  QueryKeys[QueryKeyCategories][QueryKeySubcategories<QueryKeyCategories>];

export const defaultQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 15 * 60 * 1000, // 15 minutes
  refetchOnWindowFocus: true,
} as const;

export const realTimeQueryOptions = {
  staleTime: 0,
  cacheTime: 60 * 1000, // 1 minute
} as const;

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: defaultQueryOptions,
    },
  });

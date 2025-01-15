import { QueryClient } from "@tanstack/react-query";

// Different query keys for different methods.
export const queryKeys = {
  zones: {
    list: ["zones"],
  },
} as const;

type QueryKeys = typeof queryKeys;
type QueryKeyCategories = keyof QueryKeys;
type QueryKeySubcategories<T extends QueryKeyCategories> = keyof QueryKeys[T];

// This basically exists to get us the query key as it appears in react query, i.e. a string in an array.
export type QueryKey =
  QueryKeys[QueryKeyCategories][QueryKeySubcategories<QueryKeyCategories>];

// first element of the queryKeys array
// Idk what Peter meant by the above comment, but QueryModel is basically QueryKey but not in an array from what I understand.
export type QueryModel = QueryKey[number];

// 5 minutes feels rather long for default stale time.
export const defaultQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 15 * 60 * 1000, // 15 minutes
  refetchOnWindowFocus: true,
} as const;

// 0 is far too quick lol but at least we're not using this.
export const realTimeQueryOptions = {
  staleTime: 0,
  cacheTime: 60 * 1000, // 1 minute
} as const;

// This just creates a query client and provides the options specified above.
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: defaultQueryOptions,
    },
  });

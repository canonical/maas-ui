import type { ValueOf } from "@canonical/react-components";

export type TSFixMe = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export const SortDirection = {
  ASCENDING: "ascending",
  DESCENDING: "descending",
  NONE: "none",
} as const;

export type Sort<K extends string | null = string> = {
  direction: ValueOf<typeof SortDirection>;
  key: K | null;
};

/**
 * Get all the keys from all objects in a union. This can be used when passing a
 * key before narrowing the object. A simple keyof can't be used in those cases
 * as keyof will only get the common keys between the objects in the union.
 */
export type KeysOfUnion<T> = T extends T ? keyof T : never;

export type RouteParams = {
  id: string;
};

export type AnalyticsEvent = {
  action: string;
  category: string;
  label: string;
};

export type HeaderContent<V extends readonly [string, string], E = never> = {
  view: V;
  extras?: E;
};

export type SetHeaderContent<H> = (headerContent: H | null) => void;

export type ClearHeaderContent = () => void;

export type SetSearchFilter = (searchFilter: string) => void;

export type AnyObject = Record<string, unknown>;

export type EmptyObject = Record<string, never>;

export type APIError<E = null> =
  | string
  | string[]
  | Record<"__all__" | string, string | string[]>
  | null
  | E;

// TypeScript doesn't currently allow passing data-* attributes (e.g. when
// passing data-testid attributes to generic components):
// https://github.com/microsoft/TypeScript/issues/28960
export type DataTestElement<E> = E & { "data-testid"?: string };

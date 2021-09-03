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

export type RouteParams = {
  id: string;
};

export type AnalyticsEvent = {
  action: string;
  category: string;
  label: string;
};

export type HeaderContent<N, E> = {
  name: N;
  extras?: E;
};

export type SetHeaderContent<H> = (headerContent: H | null) => void;

export type ClearHeaderContent = () => void;

export type AnyObject = Record<string, unknown>;

export type EmptyObject = Record<string, never>;

export type APIError<E = null> =
  | string
  | string[]
  | Record<"__all__" | string, string | string[]>
  | null
  | E;

// TypeScript doesn't currently allow passing data-* attributes (e.g. when
// passing data-test attributes to generic components):
// https://github.com/microsoft/TypeScript/issues/28960
export type DataTestElement<E> = E & { "data-test"?: string };

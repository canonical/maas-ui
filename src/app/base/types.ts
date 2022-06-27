import type { ValueOf } from "@canonical/react-components";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { ACTION_STATUS } from "./constants";

export type TSFixMe = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export type Seconds = number;
export type Minutes = number;
export type Days = number;
/**
 * hours / minutes / seconds in systemd.time timespan format, e.g. "1h 15m 20seconds"
 * https://www.freedesktop.org/software/systemd/man/systemd.time.html
 */
export type TimeSpan = string;

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

export type CommonActionFormProps<E = null> = {
  clearHeaderContent: ClearHeaderContent;
  errors?: APIError<E>;
  processingCount: number;
  viewingDetails: boolean;
};

type UsabillaConfig =
  | string
  | {
      [x: string]: unknown;
    };

export type UsabillaLive = (type: string, config?: UsabillaConfig) => void;

export type ActionStatuses = ValueOf<typeof ACTION_STATUS>;

export type ModelAction<PK> = {
  [ACTION_STATUS.error]: PK[];
  [ACTION_STATUS.loading]: PK[];
  [ACTION_STATUS.success]: PK[];
};

export type PayloadActionWithIdentifier<I, P = null> = PayloadAction<
  P,
  string,
  { identifier: I }
>;

export type StateError<A extends string, I> = {
  action: A;
  error: APIError;
  identifier: I | null;
};

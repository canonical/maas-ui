import type { FilterGroup, Machine } from "./base";

export type FilterGroupResponse = Omit<FilterGroup, "options">;

export type FetchResponseGroup = {
  collapsed: boolean;
  count: number;
  items: Machine[];
  name: string | null;
};

export type FetchResponse = {
  count: number;
  cur_page: number;
  num_pages: number;
  groups: FetchResponseGroup[];
};

import type { TSFixMe } from "app/base/types";
import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

export type Tag = Model & {
  created: string;
  updated: string;
  name: string;
  definition: string;
  comment: string;
  kernel_opts: string | null;
};

export type TagState = GenericState<Tag, TSFixMe>;

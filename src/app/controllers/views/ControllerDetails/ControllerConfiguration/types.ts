import type { Tag, TagMeta } from "app/store/tag/types";

export type ControllerConfigurationValues = {
  tags: Tag[TagMeta.PK][];
  zone: string;
  description: string;
};

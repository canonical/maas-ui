import type { Tag, TagMeta } from "app/store/tag/types";

export type DeviceConfigurationValues = {
  description: string;
  tags: Tag[TagMeta.PK][];
  zone: string;
};

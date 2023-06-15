import { Tag, TagMeta } from "app/store/tag/types";
import { argPath } from "app/utils";

const withId = argPath<{ id: Tag[TagMeta.PK] }>;

const urls = {
  index: "/tags",
  tag: {
    index: withId("/tag/:id"),
    machines: withId("/tag/:id/machines"),
    update: withId("/tag/:id/edit"),
  },
} as const;

export default urls;

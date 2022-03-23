import type { Tag, TagMeta } from "app/store/tag/types";
import { argPath } from "app/utils";

const urls = {
  tags: {
    index: "/tags",
  },
  tag: {
    base: "/tag",
    index: argPath<{ id: Tag[TagMeta.PK] }>("/tag/:id"),
    machines: argPath<{ id: Tag[TagMeta.PK] }>("/tag/:id/machines"),
  },
};

export default urls;

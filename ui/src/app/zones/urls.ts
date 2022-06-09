import type { Zone } from "app/store/zone/types";
import { argPath } from "app/utils";

const urls = {
  details: argPath<{ id: Zone["id"] }>("/zone/:id"),
  index: "/zones",
} as const;

export default urls;

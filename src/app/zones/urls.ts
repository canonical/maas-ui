import { Zone } from "app/store/zone/types";
import { argPath } from "app/utils";

const withId = argPath<{ id: Zone["id"] }>;

const urls = {
  details: withId("/zone/:id"),
  index: "/zones",
} as const;

export default urls;

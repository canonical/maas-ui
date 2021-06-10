import type { Zone } from "./base";
import type { ZoneMeta } from "./enum";

export type CreateParams = {
  description?: Zone["description"];
  name: Zone["name"];
};

export type UpdateParams = CreateParams & {
  [ZoneMeta.PK]: Zone[ZoneMeta.PK];
};

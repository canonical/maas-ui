import type { Zone, ZonePK } from "./base";
import type { ZoneMeta } from "./enum";

export type CreateParams = {
  description?: Zone["description"];
  name: Zone["name"];
};

export type DeleteParams = {
  [ZoneMeta.PK]: ZonePK;
};

export type UpdateParams = {
  [ZoneMeta.PK]: ZonePK;
} & Partial<CreateParams>;

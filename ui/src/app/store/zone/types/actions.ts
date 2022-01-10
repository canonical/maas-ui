import type { ZONE_PK } from "../constants";

import type { Zone, ZonePK } from "./base";

export type CreateParams = {
  description?: Zone["description"];
  name: Zone["name"];
};

export type DeleteParams = {
  [ZONE_PK]: ZonePK;
};

export type UpdateParams = {
  [ZONE_PK]: ZonePK;
  description?: Zone["description"];
  name?: Zone["name"];
};

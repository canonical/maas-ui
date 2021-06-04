import type { Controller } from "./base";
import type { ControllerMeta } from "./enum";

import type { Zone, ZoneMeta } from "app/store/zone/types";

export type CreateParams = {
  description?: Controller["description"];
  domain?: Controller["domain"];
  zone?: Zone[ZoneMeta.PK];
};

export type UpdateParams = CreateParams & {
  [ControllerMeta.PK]: Controller[ControllerMeta.PK];
};

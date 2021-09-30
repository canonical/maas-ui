import type { Controller } from "./base";
import type { ControllerMeta } from "./enum";

import type { ZonePK } from "app/store/zone/types";

export type CreateParams = {
  description?: Controller["description"];
  domain?: Controller["domain"];
  zone?: ZonePK;
};

export type UpdateParams = CreateParams & {
  [ControllerMeta.PK]: Controller[ControllerMeta.PK];
};

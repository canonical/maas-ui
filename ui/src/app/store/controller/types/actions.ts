import type { Controller, ControllerStatus } from "./base";
import type { ControllerMeta } from "./enum";

import type { Zone, ZoneMeta } from "app/store/zone/types";

export type Action = {
  name: string;
  status: keyof ControllerStatus;
};

export type CreateParams = {
  description?: Controller["description"];
  domain?: Controller["domain"];
  zone?: Zone[ZoneMeta.PK];
};

export type GetSummaryXmlParams = {
  systemId: Controller[ControllerMeta.PK];
  fileId: string;
};

export type GetSummaryYamlParams = {
  systemId: Controller[ControllerMeta.PK];
  fileId: string;
};

export type UpdateParams = CreateParams & {
  [ControllerMeta.PK]: Controller[ControllerMeta.PK];
};

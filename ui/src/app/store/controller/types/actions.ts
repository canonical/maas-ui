import type { Controller, ControllerDetails, ControllerStatus } from "./base";
import type { ControllerMeta } from "./enum";

import type { PowerParameters } from "app/store/types/node";
import type { Zone } from "app/store/zone/types";

export type Action = {
  name: string;
  status: keyof ControllerStatus;
};

export type CreateParams = {
  description?: Controller["description"];
  domain?: Controller["domain"];
  zone?: { name: Zone["name"] };
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
  power_parameters?: PowerParameters;
  power_type?: ControllerDetails["power_type"];
  power_parameters_skip_check?: boolean;
  tags?: Controller["tags"];
};

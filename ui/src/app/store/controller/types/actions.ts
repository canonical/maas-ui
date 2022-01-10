import type { Controller, ControllerStatus } from "./base";
import type { ControllerMeta } from "./enum";

import type { Script } from "app/store/script/types";
import type { ZonePK } from "app/store/zone/types";

export type Action = {
  name: string;
  status: keyof ControllerStatus;
};

export type CreateParams = {
  description?: Controller["description"];
  domain?: Controller["domain"];
  zone?: ZonePK;
};

export type SetZoneParams = {
  systemId: Controller[ControllerMeta.PK];
  zoneId: ZonePK;
};

export type ScriptInput = {
  [x: string]: { url: string };
};

export type TestParams = {
  systemId: Controller[ControllerMeta.PK];
  scripts?: Script[];
  enableSSH: boolean;
  scriptInputs: ScriptInput;
};

export type UpdateParams = CreateParams & {
  [ControllerMeta.PK]: Controller[ControllerMeta.PK];
};

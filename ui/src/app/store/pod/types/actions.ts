import type { Pod, PodPowerParameters, PodVM } from "./base";
import type { PodMeta, PodType } from "./enum";

import type { Domain, DomainMeta } from "app/store/domain/types";
import type { Zone, ZoneMeta } from "app/store/zone/types";

export type ComposeParams = {
  architecture?: Pod["architectures"][0];
  cores?: PodVM["pinned_cores"][0];
  cpu_speed?: Pod["cpu_speed"];
  domain?: Domain[DomainMeta.PK];
  hostname?: Pod["name"];
  hugepages_backed?: PodVM["hugepages_backed"];
  interfaces?: string;
  memory?: PodVM["memory"];
  pinned_cores?: PodVM["pinned_cores"];
  pool?: Pod["pool"];
  skip_commissioning?: boolean;
  storage?: string;
  zone?: Zone[ZoneMeta.PK];
};

export type CreateParams = {
  certificate?: PodPowerParameters["certificate"];
  cpu_over_commit_ratio?: Pod["cpu_over_commit_ratio"];
  default_macvlan_mode?: Pod["default_macvlan_mode"];
  default_storage_pool?: Pod["default_storage_pool"];
  key?: PodPowerParameters["key"];
  memory_over_commit_ratio?: Pod["memory_over_commit_ratio"];
  name?: Pod["name"];
  password?: string;
  pool?: Pod["pool"];
  power_address?: PodPowerParameters["power_address"];
  project?: PodPowerParameters["project"];
  tags?: string;
  type?: PodType;
  zone?: Pod["zone"];
};

export type DeleteParams = {
  decompose?: boolean;
  id: Pod[PodMeta.PK];
};

export type GetProjectsParams = {
  certificate?: PodPowerParameters["certificate"];
  key?: PodPowerParameters["key"];
  password?: string;
  power_address: PodPowerParameters["power_address"];
  type: PodType;
};

export type UpdateParams = CreateParams & {
  [PodMeta.PK]: Pod[PodMeta.PK];
};

import type { GenericState } from "app/store/types/state";
import type { Model } from "app/store/types/model";
import type { TSFixMe } from "app/base/types";

export type Domain = Model & {
  created: string;
  updated: string;
  name: string;
  authoritative: boolean;
  ttl: number | null;
  hosts: number;
  resource_count: number;
  displayname: string;
  is_default: boolean;
};

export type DomainState = GenericState<Domain, TSFixMe>;

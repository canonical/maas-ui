import type { TSFixMe } from "app/base/types";
import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

export type DomainResource = {
  name: string;
  system_id?: string;
  node_type?: number; // other type?
  user_id?: number;
  dnsresource_id?: number;
  ttl?: number;
  rrtype?: string;
  rrdata?: string;
  dnsdata_id?: number;
};

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
  rrsets?: DomainResource[];
};

export type DomainState = {
  active: number | null;
} & GenericState<Domain, TSFixMe>;

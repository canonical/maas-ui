import type { RecordType } from "./enum";

import type { APIError } from "app/base/types";
import type { Model } from "app/store/types/model";
import type { BaseNode, NodeType } from "app/store/types/node";
import type { GenericState } from "app/store/types/state";
import type { User } from "app/store/user/types";

export type DomainResource = {
  dnsdata_id: number | null;
  dnsresource_id: number | null;
  name: string | null;
  node_type: NodeType | null;
  rrdata: string | null;
  rrtype: RecordType;
  system_id: BaseNode["system_id"] | null;
  ttl: number | null;
  user_id: User["id"] | null;
};

export type BaseDomain = Model & {
  authoritative: boolean;
  created: string;
  displayname: string;
  hosts: number;
  is_default: boolean;
  name: string;
  resource_count: number;
  ttl: number | null;
  updated: string;
};

export type DomainDetails = BaseDomain & {
  rrsets: DomainResource[];
};

export type Domain = BaseDomain | DomainDetails;

export type DomainState = {
  active: number | null;
} & GenericState<Domain, APIError>;

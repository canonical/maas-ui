import type { TSFixMe } from "app/base/types";
import type { Model } from "app/store/types/model";
import type { BaseNode, NodeType } from "app/store/types/node";
import type { GenericState } from "app/store/types/state";
import type { User } from "app/store/user/types";

export enum RecordType {
  A = "A",
  AAAA = "AAAA",
  CNAME = "CNAME",
  MX = "MX",
  NS = "NS",
  SRV = "SRV",
  SSHPF = "SSHFP",
  TXT = "TXT",
}

export type DomainResource = {
  name: string | null;
  system_id: BaseNode["system_id"] | null;
  node_type: NodeType | null;
  user_id: User["id"] | null;
  dnsresource_id: number | null;
  ttl: number | null;
  rrtype: RecordType;
  rrdata: string | null;
  dnsdata_id: number | null;
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

import type { Subnet, SubnetMeta } from "../../subnet/types";
import type { TimestampedModel } from "../../types/model";
import type { SimpleNode } from "../../types/node";
import type { GenericState } from "../../types/state";

import type { APIError } from "@/app/base/types";

// Legacy type for table, to be removed when table is integrated with store
export type StaticDHCPLease = {
  id: number;
  comment: string | null;
  ip_address: string;
  mac_address: string;
  interface: string | null;
  node: SimpleNode | null;
  usage?: string | null;
  owner: string;
};

export type ReservedIp = TimestampedModel & {
  ip: string;
  mac_address?: string;
  comment?: string;
  subnet: Subnet[SubnetMeta.PK];
};

export type ReservedIpState = GenericState<ReservedIp, APIError>;

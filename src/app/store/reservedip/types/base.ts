import type { Subnet, SubnetMeta } from "../../subnet/types";
import type { TimestampedModel } from "../../types/model";
import type { NetworkInterface, Node, NodeType } from "../../types/node";
import type { GenericState } from "../../types/state";

import type { APIError } from "@/app/base/types";

export type ReservedIp = TimestampedModel & {
  ip: string;
  mac_address?: string;
  comment?: string;
  subnet: Subnet[SubnetMeta.PK];
  node_summary?: ReservedIpNodeSummary;
};

export type ReservedIpNodeSummary = {
  fqdn: Node["fqdn"];
  hostname: Node["hostname"];
  node_type: NodeType;
  system_id: Node["system_id"];
  via?: NetworkInterface["name"];
};

export type ReservedIpState = GenericState<ReservedIp, APIError>;

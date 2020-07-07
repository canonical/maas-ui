import type { ModelRef, SimpleNode } from "app/store/types/node";

export type Device = SimpleNode & {
  extra_macs: string[];
  fabrics: string[];
  ip_address?: string;
  ip_assignment: "external" | "dynamic" | "static";
  link_speeds: number[];
  owner: string;
  parent?: string;
  primary_mac: string;
  spaces: string[];
  subnets: string[];
  zone: ModelRef;
};

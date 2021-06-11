import type { Discovery, DiscoveryValues } from "./base";

export type DeleteParams = {
  ip: Discovery<DiscoveryValues>["ip"];
  mac: Discovery<DiscoveryValues>["mac_address"];
};

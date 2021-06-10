import type { TSFixMe } from "app/base/types";
import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

export type Discovery<V> = Model & {
  discovery_id: string;
  fabric_name: string | null;
  fabric: number;
  first_seen: string;
  hostname: string | null;
  ip: string | null;
  is_external_dhcp: boolean | null;
  last_seen: string;
  mac_address: string | null;
  mac_organization: string;
  mdns: number | null;
  neighbour: number;
  observer_hostname: string | null;
  observer_interface_name: string | null;
  observer_interface: number;
  observer_system_id: string;
  observer: number;
  subnet_cidr: string | null;
  subnet: number | null;
  vid: number | null;
  vlan: number;
  value: V;
};

export type DiscoveryValues = boolean | null | number | string;

export type DiscoveryState = GenericState<Discovery<DiscoveryValues>, TSFixMe>;

import { extend, random } from "cooky-cutter";

import { model } from "./model";

import type { Discovery, DiscoveryValues } from "app/store/discovery/types";
import type { Model } from "app/store/types/model";

export const discovery = extend<Model, Discovery<DiscoveryValues>>(model, {
  discovery_id: () => `discovery-${random()}`,
  fabric_name: "fabric-1",
  fabric: 1,
  first_seen: "1502597995.5000",
  hostname: "discovery-hostname",
  ip: "192.168.1.1",
  is_external_dhcp: false,
  last_seen: "Wed, 08 Jul. 2020 05:35:4",
  mac_address: "00:00:00:00:00:00",
  mac_organization: "Business Corp, Inc.",
  mdns: 2,
  neighbour: 3,
  observer_hostname: "observer-hostname",
  observer_interface_name: "iface-name",
  observer_interface: 4,
  observer_system_id: "abc123",
  observer: 5,
  subnet_cidr: "192.168.1.1/24",
  subnet: 6,
  vid: 7,
  vlan: 5001,
  value: false,
});

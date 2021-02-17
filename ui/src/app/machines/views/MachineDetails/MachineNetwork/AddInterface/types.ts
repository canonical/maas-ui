import type {
  NetworkInterface,
  NetworkLink,
  NetworkLinkMode,
  Vlan,
} from "app/store/machine/types";

export type AddInterfaceValues = {
  ip_address?: NetworkLink["ip_address"];
  mac_address: NetworkInterface["mac_address"];
  mode?: NetworkLinkMode;
  name?: NetworkInterface["name"];
  fabric: Vlan["fabric_id"];
  subnet?: NetworkLink["subnet_id"];
  tags?: NetworkInterface["tags"];
  vlan: NetworkInterface["vlan_id"];
};

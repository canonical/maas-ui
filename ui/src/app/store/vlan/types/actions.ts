import type { VLAN } from "./base";
import type { VLANMeta } from "./enum";

export type CreateParams = {
  description?: VLAN["description"];
  dhcp_on?: VLAN["dhcp_on"];
  fabric?: VLAN["fabric"];
  mtu?: VLAN["mtu"];
  name?: VLAN["name"];
  primary_rack?: VLAN["primary_rack"];
  relay_vlan?: VLAN["relay_vlan"];
  secondary_rack?: VLAN["secondary_rack"];
  space?: VLAN["space"];
  vid: VLAN["vid"];
};

export type UpdateParams = CreateParams & {
  [VLANMeta.PK]: VLAN[VLANMeta.PK];
};

import type { NetworkValues } from "../NetworkFields/NetworkFields";

import type {
  BondLacpRate,
  BondMode,
  BondXmitHashPolicy,
} from "app/store/general/types";
import type {
  NetworkInterface,
  NetworkInterfaceParams,
} from "app/store/machine/types";

export enum MIIOptions {
  MII = "mii",
}

export type BondFormValues = {
  bond_downdelay: NetworkInterfaceParams["bond_downdelay"];
  bond_lacp_rate: BondLacpRate;
  bond_miimon: NetworkInterfaceParams["bond_miimon"];
  bond_mode: BondMode;
  bond_updelay: NetworkInterfaceParams["bond_updelay"];
  bond_xmit_hash_policy: BondXmitHashPolicy;
  linkMonitoring: string;
  mac_address: NetworkInterface["mac_address"];
  name: NetworkInterface["name"];
  primary: NetworkInterface["id"];
  tags: NetworkInterface["tags"];
} & NetworkValues;

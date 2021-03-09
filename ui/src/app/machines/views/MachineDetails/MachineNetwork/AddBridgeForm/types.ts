import type { NetworkValues } from "../NetworkFields/NetworkFields";

import type {
  NetworkInterface,
  NetworkInterfaceParams,
} from "app/store/machine/types";

export type BridgeFormValues = {
  bridge_fd?: NetworkInterfaceParams["bridge_fd"];
  bridge_stp?: NetworkInterfaceParams["bridge_stp"];
  bridge_type: NetworkInterfaceParams["bridge_type"];
  mac_address: NetworkInterface["mac_address"];
  name: NetworkInterface["name"];
  tags?: NetworkInterface["tags"];
} & NetworkValues;

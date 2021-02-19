import type { NetworkValues } from "../NetworkFields/NetworkFields";

import type { NetworkInterface } from "app/store/machine/types";

export type AddInterfaceValues = {
  mac_address: NetworkInterface["mac_address"];
  name?: NetworkInterface["name"];
  tags?: NetworkInterface["tags"];
} & NetworkValues;

import type { NetworkValues } from "../NetworkFields/NetworkFields";

import type { NetworkInterface } from "app/store/machine/types";

export type AddAliasOrVlanValues = {
  tags?: NetworkInterface["tags"];
} & NetworkValues;

import type { NetworkValues } from "../NetworkFields/NetworkFields";

import type { NetworkInterface } from "app/store/types/node";

export type AddAliasOrVlanValues = {
  tags?: NetworkInterface["tags"];
} & NetworkValues;

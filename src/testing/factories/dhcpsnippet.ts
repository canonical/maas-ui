import { array, extend } from "cooky-cutter";

import { model, timestampedModel } from "./model";

import type {
  DHCPSnippet,
  DHCPSnippetHistory,
} from "app/store/dhcpsnippet/types";
import type { Model, TimestampedModel } from "app/store/types/model";

export const dhcpSnippetHistory = extend<Model, DHCPSnippetHistory>(model, {
  created: "Wed, 08 Jul. 2020 05:35:4",
  value: "test value",
});

export const dhcpSnippet = extend<TimestampedModel, DHCPSnippet>(
  timestampedModel,
  {
    description: "test description",
    enabled: false,
    history: array(dhcpSnippetHistory),
    name: "test snippet",
    node: null,
    subnet: null,
    iprange: null,
    value: "test value",
  }
);

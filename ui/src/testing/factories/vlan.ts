import { extend, random } from "cooky-cutter";

import { model } from "./model";

import type { Model } from "app/store/types/model";

import type { VLAN } from "app/store/vlan/types";

export const vlan = extend<Model, VLAN>(model, {
  created: "Thu, 13 Feb. 2020 14:56:05",
  description: "a vlan",
  dhcp_on: false,
  external_dhcp: null,
  fabric: random,
  mtu: random,
  name: "test-vlan",
  primary_rack: null,
  rack_sids: () => [],
  relay_vlan: null,
  secondary_rack: null,
  space: random,
  updated: "Thu, 04 Jun. 2020 02:45:47",
  vid: random,
});

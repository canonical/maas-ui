import type { Discovery } from "./base";

export type DeleteParams = {
  ip: Discovery["ip"];
  mac: Discovery["mac_address"];
};

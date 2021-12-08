import type { PowerParameters } from "app/store/types/node";

export type AddMachineValues = {
  architecture: string;
  domain: string;
  extra_macs: string[];
  hostname: string;
  min_hwe_kernel: string;
  pool: string;
  power_parameters: PowerParameters;
  power_type: string;
  pxe_mac: string;
  zone: string;
};

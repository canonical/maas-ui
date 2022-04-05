import type { TimeSpanString } from "app/store/types/node";

export type DeployFormValues = {
  default_osystem: string;
  default_distro_series: string;
  hardware_sync_interval: TimeSpanString;
};

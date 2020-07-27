import type { Model } from "app/store/types/model";
import type { TSFixMe } from "app/base/types";

export type LicenseKeys = Model & {
  distro_series: string;
  license_key: string;
  osystem: string;
  resource_uri: string;
};

export type LicenseKeysState = {
  errors: TSFixMe;
  items: LicenseKeys[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};

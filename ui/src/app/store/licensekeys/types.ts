import type { GenericState } from "app/store/types/state";
import type { Model } from "app/store/types/model";
import type { TSFixMe } from "app/base/types";

export type LicenseKeys = Model & {
  distro_series: string;
  license_key: string;
  osystem: string;
  resource_uri: string;
};

export type LicenseKeysState = GenericState<LicenseKeys, TSFixMe>;

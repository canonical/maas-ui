import type { BootResource } from "./base";
import type { BootResourceSourceType } from "./enum";

export type DeleteImageParams = {
  id: BootResource["id"];
};

export type FetchParams = {
  keyring_data?: string;
  keyring_filename?: string;
  source_type: BootResourceSourceType;
  url: string;
};

export type SaveOtherParams = {
  images: string[];
};

export type SaveUbuntuCoreParams = {
  images: string[];
};

export type SaveUbuntuParams = {
  osystems: UbuntuOsystem[];
  source_type: BootResourceSourceType;
};

export type UbuntuOsystem = {
  osystem: string;
  release: string;
  arches: string[];
};

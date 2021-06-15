import type { BootResource, BootResourceUbuntuSource } from "./base";
import type { BootResourceSourceType } from "./enum";

export type DeleteImageParams = {
  id: BootResource["id"];
};

export type FetchParams = BootResourceUbuntuSource;

export type OsystemParam = {
  osystem: string;
  release: string;
  arches: string[];
};

export type SaveOtherParams = {
  images: string[];
};

export type SaveUbuntuCoreParams = {
  images: string[];
};

export type SaveUbuntuParams = {
  osystems: OsystemParam[];
  source_type: BootResourceSourceType;
};

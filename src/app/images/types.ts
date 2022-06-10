import type {
  BootResource,
  BootResourceMeta,
} from "app/store/bootresource/types";

export type ImageValue = {
  arch: string;
  os: string;
  release: string;
  resourceId?: BootResource[BootResourceMeta.PK];
  subArch?: string;
  title: string;
};

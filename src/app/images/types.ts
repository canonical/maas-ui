import type {
  BootResource,
  BootResourceMeta,
} from "@/app/store/bootresource/types";
import type { UtcDatetime } from "@/app/store/types/model";

export type Image = {
  id: number;
  release: string;
  architecture: string;
  name: string;
  size: string;
  lastSynced: string | null;
  canDeployToMemory: boolean;
  status: string;
  lastDeployed: UtcDatetime;
  machines: number;
  resource: BootResource;
};

export type ImageValue = {
  arch: string;
  os: string;
  release: string;
  resourceId?: BootResource[BootResourceMeta.PK];
  subArch?: string;
  title: string;
};

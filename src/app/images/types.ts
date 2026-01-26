import type {
  ImageResponse,
  ImageStatisticResponse,
  ImageStatusResponse,
} from "@/app/apiclient";

export type Image = Omit<
  ImageResponse &
    Partial<ImageStatisticResponse> &
    Partial<ImageStatusResponse>,
  "id"
> & { id: string; isUpstream: boolean };

export enum BootResourceSourceType {
  MAAS_IO = "maas.io",
  CUSTOM = "custom",
}

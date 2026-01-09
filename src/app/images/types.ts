import type {
  ImageResponse,
  ImageStatisticResponse,
  ImageStatusResponse,
} from "@/app/apiclient";

export type Image = ImageResponse &
  Partial<ImageStatisticResponse> &
  Partial<ImageStatusResponse>;

export enum BootResourceSourceType {
  MAAS_IO = "maas.io",
  CUSTOM = "custom",
}

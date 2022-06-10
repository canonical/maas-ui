import type {
  BootResource,
  BootResourceFetchedImages,
  BootResourceUbuntu,
  BootResourceOtherImage,
  BootResourceUbuntuCoreImage,
} from "./base";

export type BootResourceFetchResponse = BootResourceFetchedImages;

export type BootResourcePollResponse = {
  connection_error: boolean;
  other_images: BootResourceOtherImage[];
  rack_import_running: boolean;
  region_import_running: boolean;
  resources: BootResource[];
  ubuntu: BootResourceUbuntu;
  ubuntu_core_images: BootResourceUbuntuCoreImage[];
};

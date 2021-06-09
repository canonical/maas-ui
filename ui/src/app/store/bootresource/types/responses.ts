import type {
  BootResource,
  BootResourceUbuntu,
  BootResourceOtherImage,
  BootResourceUbuntuCoreImage,
} from "./base";

export type BootResourcePollResponse = {
  connection_error: boolean;
  other_images: BootResourceOtherImage[];
  rack_import_running: boolean;
  region_import_running: boolean;
  resources: BootResource[];
  ubuntu: BootResourceUbuntu;
  ubuntu_core_images: BootResourceUbuntuCoreImage[];
};

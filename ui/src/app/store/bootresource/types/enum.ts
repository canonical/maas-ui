export enum BootResourceAction {
  DELETE_IMAGE = "deleteImage",
  FETCH = "fetch",
  POLL = "poll",
  SAVE_OTHER = "saveOther",
  SAVE_UBUNTU = "saveUbuntu",
  SAVE_UBUNTU_CORE = "saveUbuntuCore",
  STOP_IMPORT = "stopImport",
}

export enum BootResourceMeta {
  MODEL = "bootresource",
  PK = "id",
}

export enum BootResourceSourceType {
  MAAS_IO = "maas.io",
  CUSTOM = "custom",
}

export enum BootResourceType {
  SYNCED = 0,
  GENERATED = 1,
  UPLOADED = 2,
}

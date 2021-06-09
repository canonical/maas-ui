export enum BootResourceAction {
  POLL = "poll",
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

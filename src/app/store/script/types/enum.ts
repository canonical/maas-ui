export enum ScriptMeta {
  MODEL = "script",
  PK = "id",
}

export enum ScriptType {
  COMMISSIONING = 0,
  TESTING = 2,
  DEPLOYMENT = 4,
  // placeholder — confirm value with backend
  SWITCH = 6,
}

export enum ScriptName {
  CONFIGURE_HBA = "configure_hba",
  NONE = "none",
  UPDATE_FIRMWARE = "update_firmware",
}

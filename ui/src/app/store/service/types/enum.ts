export enum ServiceMeta {
  MODEL = "service",
  PK = "id",
}

export enum ServiceStatus {
  DEAD = "dead", // Service is dead. (Should be on but is off).
  DEGRADED = "degraded", // Service is running but is in a degraded state.
  OFF = "off", // Service is off. (Should be off and is off).
  RUNNING = "running", // Service is running and operational.
  UNKNOWN = "unknown", // Status of the service is not known.
}

/* The following constants should be made generic, usable across models. */
export const ACTION_STATUS = {
  failed: "failed",
  processing: "processing",
  successful: "successful",
} as const;
/***************************/

export const ZONE_PK = "id";

export const ZONE_MODEL = "zone";

export const ZONE_ACTIONS = {
  cleanup: "cleanup",
  create: "create",
  delete: "delete",
  fetch: "fetch",
  update: "update",
} as const;

export const ZONE_WEBSOCKET_METHODS = {
  create: "create",
  delete: "delete",
  list: "list",
  update: "update",
} as const;

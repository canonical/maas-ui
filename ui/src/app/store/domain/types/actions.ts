import type { Domain } from "./base";
import type { DomainMeta } from "./enum";

export type CreateParams = {
  authoritative?: Domain["authoritative"];
  name: Domain["name"];
  ttl?: Domain["ttl"];
};

export type UpdateParams = CreateParams & {
  [DomainMeta.PK]: Domain[DomainMeta.PK];
};

export type SetDefaultErrors = string | number | { domain: string[] };

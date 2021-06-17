import type { Domain, DomainResource } from "./base";
import type { DomainMeta } from "./enum";

export type CreateAddressRecordParams = {
  address_ttl: DomainResource["ttl"] | null;
  domain: Domain[DomainMeta.PK];
  ip_addresses: string[];
  name: DomainResource["name"];
};

export type CreateDNSDataParams = {
  domain: Domain[DomainMeta.PK];
  name: DomainResource["name"];
  rrdata: DomainResource["rrdata"];
  rrtype: DomainResource["rrtype"];
  ttl: DomainResource["ttl"];
};

export type CreateParams = {
  authoritative?: Domain["authoritative"];
  name: Domain["name"];
  ttl?: Domain["ttl"];
};

export type SetDefaultErrors = string | number | { domain: string[] };

export type UpdateParams = CreateParams & {
  [DomainMeta.PK]: Domain[DomainMeta.PK];
};

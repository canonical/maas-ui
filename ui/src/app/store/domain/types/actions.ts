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

// FIXME: these types here are reverse-engineered from WS calls and legacy code, may need review
type UpdateResourceParams = DomainResource & {
  domain: Domain["id"];
  previous_name: DomainResource["name"];
  previous_rrdata: DomainResource["rrdata"];
  previous_rrtype: DomainResource["rrtype"];
  previous_ttl: DomainResource["ttl"];
};

export type UpdateDnsResourceParams = UpdateResourceParams & {
  address_ttl?: DomainResource["ttl"];
};

export type UpdateAddressRecordParams = UpdateResourceParams & {
  address_ttl: DomainResource["ttl"];
  dnsdata_id: number | null;
  ip_addresses: string[];
};

export type UpdateDnsDataParams = UpdateResourceParams & {
  dnsdata_id: number | null;
};

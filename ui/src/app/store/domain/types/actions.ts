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

export type updateDnsResourceParams = {
  // Here are the params that I can see in the devtools
  // address_ttl: ""
  // dnsdata_id: null
  // dnsresource_id: 279
  // domain: "36"
  // name: "AAAAAAAAAAAAAAAAAdd"
  // node_type: null
  // previous_name: "AAAAAAAAAAAAAAAAA"
  // previous_rrdata: "0.0.0.0"
  // previous_rrtype: "A"
  // previous_ttl: null
  // rrdata: "0.0.0.01"
  // rrtype: "A"
  // system_id: null
  // ttl: null
  // user_id: 70
};
export type updateAddressRecordParams = {
  // Here are the params that I can see in the devtools
  // address_ttl: ""
  // dnsdata_id: null
  // dnsresource_id: 279
  // domain: "36"
  // ip_addresses: ["0.0.0.01"]
  // name: "AAAAAAAAAAAAAAAAAdd"
  // node_type: null
  // previous_name: "AAAAAAAAAAAAAAAAAdd"
  // previous_rrdata: "0.0.0.0"
  // previous_rrtype: "A"
  // previous_ttl: null
  // rrdata: "0.0.0.01"
  // rrtype: "A"
  // system_id: null
  // ttl: null
  // user_id: 70
};
export type updateDnsDataParams = {
  // Here are the params that I can see in the devtools
  // dnsdata_id: 36
  // dnsresource_id: 288
  // domain: "36"
  // name: "srv"
  // node_type: null
  // previous_name: "srv"
  // previous_rrdata: "1 2 3 4"
  // previous_rrtype: "SRV"
  // previous_ttl: null
  // rrdata: "1 2 3 34"
  // rrtype: "SRV"
  // system_id: null
  // ttl: ""
  // user_id: null
};

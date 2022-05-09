import { define, extend, random } from "cooky-cutter";

import { timestampedModel } from "./model";

import type {
  Domain,
  DomainDetails,
  DomainResource,
} from "app/store/domain/types";
import { RecordType } from "app/store/domain/types";
import type { TimestampedModel } from "app/store/types/model";

export const domain = extend<TimestampedModel, Domain>(timestampedModel, {
  authoritative: false,
  displayname: "test display",
  hosts: random,
  is_default: false,
  name: "test name",
  resource_count: random,
  ttl: null,
});

export const domainDetails = extend<Domain, DomainDetails>(domain, {
  rrsets: () => [],
});

export const domainResource = define<DomainResource>({
  dnsdata_id: null,
  dnsresource_id: null,
  name: "test-resource",
  node_type: null,
  rrdata: "test-data",
  rrtype: RecordType.TXT,
  system_id: null,
  ttl: null,
  user_id: null,
});

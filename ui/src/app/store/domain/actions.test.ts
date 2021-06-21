import { actions } from "./slice";
import { RecordType } from "./types";

describe("domain actions", () => {
  it("creates an action for fetching domains", () => {
    expect(actions.fetch()).toEqual({
      type: "domain/fetch",
      meta: {
        model: "domain",
        method: "list",
      },
      payload: null,
    });
  });

  it("creates an action for creating domains", () => {
    expect(actions.create({ name: "new domain" })).toEqual({
      type: "domain/create",
      meta: {
        model: "domain",
        method: "create",
      },
      payload: { params: { name: "new domain" } },
    });
  });

  it("creates an action for updating domains", () => {
    expect(actions.update({ id: 1, name: "updated domain" })).toEqual({
      type: "domain/update",
      meta: {
        model: "domain",
        method: "update",
      },
      payload: { params: { id: 1, name: "updated domain" } },
    });
  });

  it("creates an action for getting a domain details", () => {
    expect(actions.get(1)).toEqual({
      type: "domain/get",
      meta: {
        model: "domain",
        method: "get",
      },
      payload: {
        params: {
          id: 1,
        },
      },
    });
  });

  it("creates an action for setting a default domain", () => {
    expect(actions.setDefault(1)).toEqual({
      type: "domain/setDefault",
      meta: {
        model: "domain",
        method: "set_default",
      },
      payload: {
        params: {
          domain: 1,
        },
      },
    });
  });

  it("can create an action for setting an active domain", () => {
    expect(actions.setActive(1)).toEqual({
      type: "domain/setActive",
      meta: {
        model: "domain",
        method: "set_active",
      },
      payload: {
        params: {
          id: 1,
        },
      },
    });
  });

  it("creates an action for creating a new DNSData record", () => {
    expect(
      actions.createDNSData({
        domain: 1,
        name: "name",
        rrtype: RecordType.TXT,
        rrdata: "Some data",
        ttl: 42,
      })
    ).toEqual({
      type: "domain/createDNSData",
      meta: {
        model: "domain",
        method: "create_dnsdata",
      },
      payload: {
        params: {
          domain: 1,
          name: "name",
          rrtype: RecordType.TXT,
          rrdata: "Some data",
          ttl: 42,
        },
      },
    });
  });

  it("creates an action for creating a new address record", () => {
    expect(
      actions.createAddressRecord({
        domain: 1,
        name: "name",
        ip_addresses: ["127.0.0.1"],
        address_ttl: null,
      })
    ).toEqual({
      type: "domain/createAddressRecord",
      meta: {
        model: "domain",
        method: "create_address_record",
      },
      payload: {
        params: {
          domain: 1,
          name: "name",
          ip_addresses: ["127.0.0.1"],
          address_ttl: null,
        },
      },
    });
    expect(
      actions.createAddressRecord({
        domain: 1,
        name: "name",
        ip_addresses: ["127.0.0.1", "0.0.0.0", "8.0.0.8"],
        address_ttl: 42,
      })
    ).toEqual({
      type: "domain/createAddressRecord",
      meta: {
        model: "domain",
        method: "create_address_record",
      },
      payload: {
        params: {
          domain: 1,
          name: "name",
          ip_addresses: ["127.0.0.1", "0.0.0.0", "8.0.0.8"],
          address_ttl: 42,
        },
      },
    });
  });
});

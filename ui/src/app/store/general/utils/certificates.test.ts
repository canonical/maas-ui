import { isTlsCertificate, splitCertificateName } from "./certificates";

import { tlsCertificate as tlsCertificateFactory } from "testing/factories";

describe("splitCertificateName", () => {
  it("handles null case", () => {
    expect(splitCertificateName(null)).toStrictEqual(null);
  });

  it("handles missing host", () => {
    expect(splitCertificateName("bad-cert")).toStrictEqual({
      host: "",
      name: "bad-cert",
    });
  });

  it("can split a certificate name into name and host", () => {
    expect(splitCertificateName("machine@host")).toStrictEqual({
      host: "host",
      name: "machine",
    });
    expect(splitCertificateName("machine@address@host")).toStrictEqual({
      host: "host",
      name: "machine@address",
    });
  });
});

describe("isTlsCertificate", () => {
  it("can determine whether a certificate is a TLS certificate", () => {
    expect(isTlsCertificate(tlsCertificateFactory())).toBe(true);
    expect(isTlsCertificate({})).toBe(false);
    expect(isTlsCertificate(null)).toBe(false);
    expect(isTlsCertificate()).toBe(false);
  });
});

import { splitCertificateName } from "./splitCertificateName";

import { generatedCertificate as certFactory } from "testing/factories";

describe("splitCertificateName", () => {
  it("handles null case", () => {
    expect(splitCertificateName(null)).toStrictEqual(null);
  });

  it("handles missing host", () => {
    expect(splitCertificateName(certFactory({ CN: "bad-cert" }))).toStrictEqual(
      {
        host: "",
        name: "bad-cert",
      }
    );
  });

  it("can split a certificate name into name and host", () => {
    expect(
      splitCertificateName(certFactory({ CN: "machine@host" }))
    ).toStrictEqual({
      host: "host",
      name: "machine",
    });
    expect(
      splitCertificateName(certFactory({ CN: "machine@address@host" }))
    ).toStrictEqual({
      host: "host",
      name: "machine@address",
    });
  });
});

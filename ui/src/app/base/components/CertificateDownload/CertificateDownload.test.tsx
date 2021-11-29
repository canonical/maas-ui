import { mount } from "enzyme";
import * as fileDownload from "js-file-download";

import CertificateDownload from "./CertificateDownload";

import type { GeneratedCertificate } from "app/store/general/types";
import { generatedCertificate as certFactory } from "testing/factories";

jest.mock("js-file-download", () => jest.fn());

describe("CertificateDownload", () => {
  let certificate: GeneratedCertificate;

  beforeEach(() => {
    certificate = certFactory({
      certificate: "certificate",
      CN: "name@host",
    });
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("can generate a download based on the certificate details", () => {
    const downloadSpy = jest.spyOn(fileDownload, "default");
    const wrapper = mount(
      <CertificateDownload
        certificate={certificate.certificate}
        filename={certificate.CN}
      />
    );
    wrapper
      .find("button[data-testid='certificate-download-button']")
      .simulate("click");

    expect(downloadSpy).toHaveBeenCalledWith(
      certificate.certificate,
      certificate.CN
    );
  });

  it("shows as a code snippet if certificate was generated", () => {
    const wrapper = mount(
      <CertificateDownload
        certificate={certificate.certificate}
        filename={certificate.CN}
        isGenerated
      />
    );

    expect(
      wrapper.find("[data-testid='certificate-code-snippet']").exists()
    ).toBe(true);
    expect(wrapper.find("[data-testid='certificate-textarea']").exists()).toBe(
      false
    );
  });

  it("shows as a textarea if certificate was not generated", () => {
    const wrapper = mount(
      <CertificateDownload
        certificate={certificate.certificate}
        filename={certificate.CN}
        isGenerated={false}
      />
    );

    expect(wrapper.find("[data-testid='certificate-textarea']").exists()).toBe(
      true
    );
    expect(
      wrapper.find("[data-testid='certificate-code-snippet']").exists()
    ).toBe(false);
  });
});

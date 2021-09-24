import { mount } from "enzyme";
import * as fileDownload from "js-file-download";

import CertificateDownload from "./CertificateDownload";

import { generatedCertificate as certFactory } from "testing/factories";

jest.mock("js-file-download", () => jest.fn());

describe("CertificateDownload", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("can generate a download based on the certificate details", () => {
    const downloadSpy = jest.spyOn(fileDownload, "default");
    const certificate = certFactory({
      certificate: "certificate",
      CN: "name@host",
    });
    const wrapper = mount(
      <CertificateDownload
        certificate={certificate.certificate}
        filename={certificate.CN}
      />
    );
    wrapper
      .find("button[data-test='certificate-download-button']")
      .simulate("click");

    expect(downloadSpy).toHaveBeenCalledWith(
      certificate.certificate,
      certificate.CN
    );
  });
});

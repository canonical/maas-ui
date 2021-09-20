import { shallow } from "enzyme";

import CertificateMetadata from "./CertificateMetadata";

import { generatedCertificate as certificateFactory } from "testing/factories";

describe("CertificateMetadata", () => {
  it("renders", () => {
    const certificate = certificateFactory({
      CN: "name@host",
      expiration: "expiration",
      fingerprint: "fingerprint",
    });
    const wrapper = shallow(<CertificateMetadata certificate={certificate} />);

    expect(wrapper).toMatchSnapshot();
  });
});

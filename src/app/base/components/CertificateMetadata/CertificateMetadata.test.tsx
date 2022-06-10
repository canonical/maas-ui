import { shallow } from "enzyme";

import CertificateMetadata from "./CertificateMetadata";

import { certificateMetadata as metadataFactory } from "testing/factories";

describe("CertificateMetadata", () => {
  it("renders", () => {
    const metadata = metadataFactory({
      CN: "name@host",
      expiration: "expiration",
      fingerprint: "fingerprint",
    });
    const wrapper = shallow(<CertificateMetadata metadata={metadata} />);

    expect(wrapper).toMatchSnapshot();
  });
});

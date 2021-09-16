import { shallow } from "enzyme";

import CertificateDownload from "./CertificateDownload";

describe("CertificateDownload", () => {
  it("renders", () => {
    const wrapper = shallow(
      <CertificateDownload certificateString="certificate" />
    );

    expect(wrapper).toMatchSnapshot();
  });
});

import { mount } from "enzyme";
import { Formik } from "formik";

import OtherImagesSelect from "./OtherImagesSelect";

import {
  bootResource as bootResourceFactory,
  bootResourceOtherImage as otherImageFactory,
} from "testing/factories";

describe("OtherImagesSelect", () => {
  it("correctly shows when an image checkbox is checked", () => {
    const otherImages = [
      otherImageFactory({
        name: "centos/amd64/generic/centos7",
        title: "CentOS 7",
      }),
      otherImageFactory({ name: "centos/amd64/generic/8", title: "CentOS 8" }),
    ];
    const resources = [bootResourceFactory()];
    const wrapper = mount(
      <Formik
        initialValues={{
          images: [
            {
              arch: "amd64",
              os: "centos",
              release: "centos7",
              subArch: "generic",
              title: "CentOS 7",
            },
          ],
        }}
        onSubmit={jest.fn()}
      >
        <OtherImagesSelect otherImages={otherImages} resources={resources} />
      </Formik>
    );
    const imageChecked = (id: string) =>
      wrapper
        .findWhere((n) => n.name() === "Input" && n.prop("id") === id)
        .prop("checked");

    expect(imageChecked("other-image-centos/amd64/generic/centos7")).toBe(true);
    expect(imageChecked("other-image-centos/amd64/generic/8")).toBe(false);
  });
});

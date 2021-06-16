import { mount } from "enzyme";
import { Formik } from "formik";

import ImagesTable from "./ImagesTable";

import { bootResource as resourceFactory } from "testing/factories";

describe("ImagesTable", () => {
  it("renders the correct status for a downloaded image that is selected", () => {
    const resource = resourceFactory({
      arch: "amd64",
      complete: true,
      name: "ubuntu/focal",
    });
    const wrapper = mount(
      <Formik
        initialValues={{
          images: [
            {
              arch: resource.arch,
              os: "ubuntu",
              release: "focal",
              title: "20.04 LTS",
            },
          ],
        }}
        onSubmit={jest.fn()}
      >
        <ImagesTable resources={[resource]} />
      </Formik>
    );
    expect(
      wrapper.find("[data-test='resource-status'] Icon").prop("name")
    ).toBe("success");
    expect(wrapper.find("[data-test='resource-status']").text()).toBe(
      resource.status
    );
  });

  it("renders the correct status for a downloaded image that is not selected", () => {
    const resource = resourceFactory({
      arch: "amd64",
      complete: true,
      name: "ubuntu/focal",
    });
    const wrapper = mount(
      <Formik
        initialValues={{
          images: [],
        }}
        onSubmit={jest.fn()}
      >
        <ImagesTable resources={[resource]} />
      </Formik>
    );
    expect(
      wrapper.find("[data-test='resource-status'] Icon").prop("name")
    ).toBe("error");
    expect(wrapper.find("[data-test='resource-status']").text()).toBe(
      "Will be deleted"
    );
  });

  it("renders the correct data for a new image", () => {
    const wrapper = mount(
      <Formik
        initialValues={{
          images: [
            {
              arch: "arch",
              os: "os",
              release: "release",
              title: "New release",
            },
          ],
        }}
        onSubmit={jest.fn()}
      >
        <ImagesTable resources={[]} />
      </Formik>
    );
    expect(wrapper.find("td[data-test='new-image-title']").text()).toBe(
      "New release"
    );
    expect(
      wrapper.find("[data-test='new-image-status'] Icon").prop("name")
    ).toBe("pending");
    expect(wrapper.find("[data-test='new-image-status']").text()).toBe(
      "Selected for download"
    );
  });
});

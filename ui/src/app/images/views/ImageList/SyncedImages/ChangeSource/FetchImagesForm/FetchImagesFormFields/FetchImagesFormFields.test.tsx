import { mount } from "enzyme";
import { Formik } from "formik";

import FetchImagesFormFields from "./FetchImagesFormFields";

import { BootResourceSourceType } from "app/store/bootresource/types";
import { waitForComponentToPaint } from "testing/utils";

describe("FetchImagesFormFields", () => {
  it("does not show extra fields if maas.io source is selected", async () => {
    const wrapper = mount(
      <Formik
        initialValues={{
          keyring_data: "",
          keyring_filename: "",
          source_type: BootResourceSourceType.MAAS_IO,
          url: "",
        }}
        onSubmit={jest.fn()}
      >
        <FetchImagesFormFields />
      </Formik>
    );
    expect(wrapper.find("input[name='url']").exists()).toBe(false);
    expect(wrapper.find("input[name='keyring_filename']").exists()).toBe(false);
    expect(wrapper.find("input[name='keyring_data']").exists()).toBe(false);
  });

  it("shows url fields if custom source is selected", async () => {
    const wrapper = mount(
      <Formik
        initialValues={{
          keyring_data: "",
          keyring_filename: "",
          source_type: BootResourceSourceType.CUSTOM,
          url: "",
        }}
        onSubmit={jest.fn()}
      >
        <FetchImagesFormFields />
      </Formik>
    );
    expect(wrapper.find("input[name='url']").exists()).toBe(true);
    expect(wrapper.find("input[name='keyring_filename']").exists()).toBe(false);
    expect(wrapper.find("input[name='keyring_data']").exists()).toBe(false);
  });

  it("resets fields when switching to maas.io source", async () => {
    const wrapper = mount(
      <Formik
        initialValues={{
          keyring_data: "data",
          keyring_filename: "/path/to/file",
          source_type: BootResourceSourceType.CUSTOM,
          url: "http://www.example.com",
        }}
        onSubmit={jest.fn()}
      >
        <FetchImagesFormFields />
      </Formik>
    );
    // Switch to maas.io source and back
    wrapper.find("input[id='maas-source']").simulate("change", {
      target: { checked: "checked", id: "maas-source" },
    });
    await waitForComponentToPaint(wrapper);
    wrapper.find("input[id='custom-source']").simulate("change", {
      target: { checked: "checked", id: "custom-source" },
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("input[name='url']").prop("value")).toBe("");
  });

  it(`shows advanced fields when using a custom source and the "Show advanced"
    button is clicked`, async () => {
    const wrapper = mount(
      <Formik
        initialValues={{
          keyring_data: "",
          keyring_filename: "",
          source_type: BootResourceSourceType.CUSTOM,
          url: "",
        }}
        onSubmit={jest.fn()}
      >
        <FetchImagesFormFields />
      </Formik>
    );
    expect(wrapper.find("input[name='keyring_filename']").exists()).toBe(false);
    expect(wrapper.find("input[name='keyring_data']").exists()).toBe(false);

    // Click the "Show advanced" button
    wrapper.find("button[data-test='show-advanced']").simulate("click");
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("input[name='keyring_filename']").exists()).toBe(true);
    expect(wrapper.find("textarea[name='keyring_data']").exists()).toBe(true);
  });

  it("resets advanced field values when the Hide advanced button is clicked", async () => {
    const wrapper = mount(
      <Formik
        initialValues={{
          keyring_data: "data",
          keyring_filename: "/path/to/file",
          source_type: BootResourceSourceType.CUSTOM,
          url: "http://www.example.com",
        }}
        onSubmit={jest.fn()}
      >
        <FetchImagesFormFields />
      </Formik>
    );
    // Click the "Hide advanced" button
    wrapper.find("button[data-test='hide-advanced']").simulate("click");
    await waitForComponentToPaint(wrapper);

    // Click the "Show advanced" button - advanced fields should've been cleared
    wrapper.find("button[data-test='show-advanced']").simulate("click");
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("input[name='url']").prop("value")).toBe(
      "http://www.example.com"
    );
    expect(wrapper.find("input[name='keyring_filename']").prop("value")).toBe(
      ""
    );
    expect(wrapper.find("textarea[name='keyring_data']").prop("value")).toBe(
      ""
    );
  });
});

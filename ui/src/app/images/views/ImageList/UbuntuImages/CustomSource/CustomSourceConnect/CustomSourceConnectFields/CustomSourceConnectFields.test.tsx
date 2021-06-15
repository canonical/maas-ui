import { mount } from "enzyme";
import { Formik } from "formik";

import CustomSourceConnectFields from "./CustomSourceConnectFields";

import { waitForComponentToPaint } from "testing/utils";

describe("CustomSourceConnectFields", () => {
  it("shows advanced fields when the Show advanced button is clicked", async () => {
    const wrapper = mount(
      <Formik
        initialValues={{ keyring_data: "", keyring_filename: "", url: "" }}
        onSubmit={jest.fn()}
      >
        <CustomSourceConnectFields />
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
          url: "http://www.example.com",
        }}
        onSubmit={jest.fn()}
      >
        <CustomSourceConnectFields />
      </Formik>
    );
    // Click the "Show advanced" button
    wrapper.find("button[data-test='show-advanced']").simulate("click");
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("input[name='url']").prop("value")).toBe(
      "http://www.example.com"
    );
    expect(wrapper.find("input[name='keyring_filename']").prop("value")).toBe(
      "/path/to/file"
    );
    expect(wrapper.find("textarea[name='keyring_data']").prop("value")).toBe(
      "data"
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

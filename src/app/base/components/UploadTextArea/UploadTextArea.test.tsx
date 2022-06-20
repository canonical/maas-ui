import { mount } from "enzyme";
import { Formik } from "formik";

import UploadTextArea from "./UploadTextArea";

import { waitForComponentToPaint } from "testing/utils";
class MockFileReader {
  result: string;
  constructor() {
    this.result = "test file content";
  }
  onabort = () => undefined;
  onerror = () => undefined;
  onloadend = () => undefined;
  readAsText() {
    this.onloadend();
  }
}

const createFile = (
  name: string,
  size: number,
  type: string,
  contents = ""
) => {
  const file = new File([contents], name, { type });
  Reflect.defineProperty(file, "size", {
    get() {
      return size;
    },
  });
  return file;
};

describe("UploadTextArea", () => {
  beforeEach(async () => {
    const mockedFileReader = jest.spyOn(window, "FileReader");
    (mockedFileReader as jest.Mock).mockImplementation(
      () => new MockFileReader()
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("accepts files of any mimetype", async () => {
    const files = [createFile("foo.sh", 2000, "")];
    const wrapper = mount(
      <Formik initialValues={{ key: "" }} onSubmit={jest.fn()}>
        <UploadTextArea label="Upload" name="key" />
      </Formik>
    );
    wrapper.find("UploadTextArea input[type='file']").simulate("change", {
      target: { files },
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("FormikField[name='key']").prop("error")).toEqual(null);
  });

  it("displays an error if a file is larger than max size", async () => {
    const files = [createFile("foo.sh", 2000000, "")];
    const wrapper = mount(
      <Formik initialValues={{ key: "" }} onSubmit={jest.fn()}>
        <UploadTextArea label="Upload" maxSize={1000000} name="key" />
      </Formik>
    );
    wrapper.find("UploadTextArea input[type='file']").simulate("change", {
      target: { files },
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("FormikField[name='key']").prop("error")).toEqual(
      "File cannot be larger than 1MB."
    );
  });

  it("can populate the textarea from the file", async () => {
    const files = [createFile("foo.sh", 2000, "text/script")];
    const wrapper = mount(
      <Formik initialValues={{ key: "" }} onSubmit={jest.fn()}>
        <UploadTextArea label="Upload" name="key" />
      </Formik>
    );
    wrapper.find("UploadTextArea input[type='file']").simulate("change", {
      target: { files },
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("textarea[name='key']").prop("value")).toEqual(
      "test file content"
    );
  });

  it("clears errors on textarea change", async () => {
    const files = [createFile("foo.sh", 2000000, "text/script")];
    const wrapper = mount(
      <Formik initialValues={{ key: "" }} onSubmit={jest.fn()}>
        <UploadTextArea label="Upload" maxSize={1000000} name="key" />
      </Formik>
    );
    // Create a max size error
    wrapper.find("UploadTextArea input[type='file']").simulate("change", {
      target: { files },
    });
    await waitForComponentToPaint(wrapper);
    expect(
      wrapper.find("FormikField[name='key']").prop("error")
    ).not.toBeFalsy();

    // Clear error by changing textarea
    wrapper.find("textarea[name='key']").simulate("change", {
      target: { name: "key", value: "new-value" },
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("FormikField[name='key']").prop("error")).toBeFalsy();
  });
});

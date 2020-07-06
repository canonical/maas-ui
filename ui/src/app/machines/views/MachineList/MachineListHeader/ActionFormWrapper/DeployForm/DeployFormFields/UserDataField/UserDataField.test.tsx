import { act } from "react-dom/test-utils";
import configureStore from "redux-mock-store";
import { mount, ReactWrapper } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { Provider } from "react-redux";

import { machine as machineFactory } from "testing/factories";
import { TSFixMe } from "app/base/types";
import DeployForm from "../../DeployForm";

const mockStore = configureStore();

class MockFileReader {
  result: string;
  constructor() {
    this.result = "test file content";
  }
  onabort() {
    // This method can be overridden in this test file as needed.
  }
  onerror() {
    // This method can be overridden in this test file as needed.
  }
  onload() {
    // This method can be overridden in this test file as needed.
  }
  readAsText() {
    this.onload();
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

describe("DeployFormFields", () => {
  let state: TSFixMe;
  let wrapper: ReactWrapper;

  beforeEach(async () => {
    const machines = [machineFactory(), machineFactory()];
    state = {
      config: {
        items: [
          {
            name: "default_osystem",
            value: "ubuntu",
            choices: [
              ["centos", "CentOS"],
              ["ubuntu", "Ubuntu"],
            ],
          },
        ],
        errors: {},
        loaded: true,
        loading: false,
      },
      general: {
        defaultMinHweKernel: {
          data: "",
          errors: {},
          loaded: true,
          loading: false,
        },
        osInfo: {
          data: {
            osystems: [
              ["centos", "CentOS"],
              ["ubuntu", "Ubuntu"],
            ],
            releases: [
              ["centos/centos66", "CentOS 6"],
              ["centos/centos70", "CentOS 7"],
              ["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"'],
              ["ubuntu/focal", 'Ubuntu 20.04 LTS "Focal Fossa"'],
            ],
            kernels: {
              ubuntu: {
                bionic: [
                  ["ga-18.04", "bionic (ga-18.04)"],
                  ["ga-18.04-lowlatency", "bionic (ga-18.04-lowlatency)"],
                  ["hwe-18.04", "bionic (hwe-18.04)"],
                  ["hwe-18.04-edge", "bionic (hwe-18.04-edge)"],
                  ["hwe-18.04-lowlatency", "bionic (hwe-18.04-lowlatency)"],
                  [
                    "hwe-18.04-lowlatency-edge",
                    "bionic (hwe-18.04-lowlatency-edge)",
                  ],
                ],
                focal: [
                  ["ga-20.04", "focal (ga-20.04)"],
                  ["ga-20.04-lowlatency", "focal (ga-20.04-lowlatency)"],
                ],
              },
            },
            default_osystem: "ubuntu",
            default_release: "focal",
          },
          errors: {},
          loaded: true,
          loading: false,
        },
      },
      machine: {
        errors: {},
        loading: false,
        loaded: true,
        items: machines,
        selected: [],
        statuses: machines.reduce((statuses, { system_id }) => {
          statuses[system_id] = {};
          return statuses;
        }, {}),
      },
      user: {
        auth: {
          saved: false,
          user: {
            email: "test@example.com",
            global_permissions: ["machine_create"],
            id: 1,
            is_superuser: true,
            last_name: "",
            sshkeys_count: 1,
            username: "admin",
          },
        },
        errors: {},
        items: [],
        loaded: true,
        loading: false,
        saved: false,
        saving: false,
      },
    };
    const store = mockStore(state);
    const mockedFileReader = jest.spyOn(window, "FileReader");
    (mockedFileReader as jest.Mock).mockImplementation(
      () => new MockFileReader()
    );
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <DeployForm
            processing={false}
            setProcessing={jest.fn()}
            setSelectedAction={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      wrapper.find("input[name='includeUserData']").simulate("change", {
        target: { name: "includeUserData", checked: true },
      });
    });
    wrapper.update();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("accepts files of text mimetype", async () => {
    const files = [createFile("foo.sh", 2000, "text/script")];
    await act(async () => {
      wrapper.find("UserDataField input[type='file']").simulate("change", {
        target: { files },
      });
    });
    wrapper.update();
    expect(wrapper.find("FormikField[name='userData']").prop("error")).toEqual(
      null
    );
  });

  it("displays an error if a file with a non text mimetype is uploaded", async () => {
    const files = [createFile("foo.jpg", 200, "image/jpg")];
    await act(async () => {
      wrapper.find("UserDataField input[type='file']").simulate("change", {
        target: { files },
      });
    });
    wrapper.update();
    expect(wrapper.find("FormikField[name='userData']").prop("error")).toEqual(
      "File type must be text/*, application/x-csh, application/x-sh, application/x-shellscript, application/json, application/ld+json, application/x-yaml"
    );
  });

  it("displays an error if a file larger than 2MB is uploaded", async () => {
    const files = [createFile("foo.sh", 3000000, "text/script")];
    await act(async () => {
      wrapper.find("UserDataField input[type='file']").simulate("change", {
        target: { files },
      });
    });
    wrapper.update();
    expect(wrapper.find("FormikField[name='userData']").prop("error")).toEqual(
      "File is larger than 2000000 bytes"
    );
  });

  it("displays a single error if multiple files are uploaded", async () => {
    const files = [
      createFile("foo.sh", 1000, "text/script"),
      createFile("bar.sh", 1000, "text/script"),
    ];
    await act(async () => {
      wrapper.find("UserDataField input[type='file']").simulate("change", {
        target: { files },
      });
    });
    wrapper.update();
    expect(wrapper.find("FormikField[name='userData']").prop("error")).toEqual(
      "Only a single file may be uploaded."
    );
  });

  it("can populate the textarea from the file", async () => {
    const files = [createFile("foo.sh", 2000, "text/script")];
    await act(async () => {
      wrapper.find("UserDataField input[type='file']").simulate("change", {
        target: { files },
      });
    });
    wrapper.update();
    expect(wrapper.find("textarea[name='userData']").prop("value")).toEqual(
      "test file content"
    );
  });
});

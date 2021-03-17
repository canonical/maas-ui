import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import FilesystemFields from "./FilesystemFields";

import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("FilesystemFields", () => {
  it("only shows filesystem types that require a storage device", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            supported_filesystems: [
              { key: "fat32", ui: "fat32" }, // reuuires storage
              { key: "ramfs", ui: "ramfs" }, // does not require storage
            ],
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik
          initialValues={{ fstype: "", mountOptions: "", mountPoint: "" }}
          onSubmit={jest.fn()}
        >
          <FilesystemFields systemId="abc123" />
        </Formik>
      </Provider>
    );

    expect(
      wrapper.find("FormikField[name='fstype'] option[value='fat32']").exists()
    ).toBe(true);
    expect(
      wrapper.find("FormikField[name='fstype'] option[value='ramfs']").exists()
    ).toBe(false);
  });

  it("disables mount point and options if no fstype selected", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            supported_filesystems: [{ key: "fat32", ui: "fat32" }],
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik
          initialValues={{ fstype: "", mountOptions: "", mountPoint: "" }}
          onSubmit={jest.fn()}
        >
          <FilesystemFields systemId="abc123" />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("Input[name='mountOptions']").prop("disabled")).toBe(
      true
    );
    expect(wrapper.find("Input[name='mountPoint']").prop("disabled")).toBe(
      true
    );
  });

  it("disables mount point field if swap fstype selected", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            supported_filesystems: [{ key: "swap", ui: "swap" }],
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik
          initialValues={{ fstype: "swap", mountOptions: "", mountPoint: "" }}
          onSubmit={jest.fn()}
        >
          <FilesystemFields systemId="abc123" />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("Input[name='mountOptions']").prop("disabled")).toBe(
      false
    );
    expect(wrapper.find("Input[name='mountPoint']").prop("disabled")).toBe(
      true
    );
    expect(wrapper.find("Input[name='mountPoint']").prop("placeholder")).toBe(
      "none"
    );
  });
});
